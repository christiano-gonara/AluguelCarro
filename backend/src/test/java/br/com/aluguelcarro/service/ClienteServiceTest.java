package br.com.aluguelcarro.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.aluguelcarro.dto.Dtos.ClienteResponse;
import br.com.aluguelcarro.dto.Dtos.EmpregadorDto;
import br.com.aluguelcarro.exception.RegraNegocioException;
import br.com.aluguelcarro.model.Cliente;
import br.com.aluguelcarro.model.StatusPedido;
import br.com.aluguelcarro.model.Usuario;
import br.com.aluguelcarro.repository.ClienteRepository;
import br.com.aluguelcarro.repository.PedidoAluguelRepository;
import br.com.aluguelcarro.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clientes;

    @Mock
    private UsuarioRepository usuarios;

    @Mock
    private PedidoAluguelRepository pedidos;

    private ClienteService service;
    private Cliente cliente;
    private Usuario usuario;

    @BeforeEach
    void preparar() {
        service = new ClienteService(clientes, usuarios, pedidos);
        cliente = Fixtures.cliente(1L, "Cliente de Demonstração");
        usuario = Fixtures.clienteUsuario("cliente.demo", cliente);
    }

    @Test
    void atualizarDadosRecalculaRendaTotal() {
        when(usuarios.findByUsername("cliente.demo")).thenReturn(Optional.of(usuario));
        when(clientes.existsByCpfAndIdNot("98765432100", 1L)).thenReturn(false);

        ClienteResponse resposta = service.atualizar("cliente.demo", Fixtures.clienteRequest(
                "98765432100", "Cliente Atualizado",
                new EmpregadorDto("Empresa A", new BigDecimal("1500.00")),
                new EmpregadorDto("Freelas", new BigDecimal("500.50"))));

        assertEquals("Cliente Atualizado", resposta.nome());
        assertEquals(0, new BigDecimal("2000.50").compareTo(resposta.rendimentoTotal()));
    }

    @Test
    void naoAceitaCpfDeOutroCliente() {
        when(usuarios.findByUsername("cliente.demo")).thenReturn(Optional.of(usuario));
        when(clientes.existsByCpfAndIdNot("98765432100", 1L)).thenReturn(true);

        assertThrows(RegraNegocioException.class,
                () -> service.atualizar("cliente.demo", Fixtures.clienteRequest("98765432100", "Cliente")));
    }

    @Test
    void naoApagaContaComContratoExecutado() {
        when(usuarios.findByUsername("cliente.demo")).thenReturn(Optional.of(usuario));
        when(pedidos.existsByClienteIdAndStatus(1L, StatusPedido.CONTRATO_EXECUTADO)).thenReturn(true);

        assertThrows(RegraNegocioException.class, () -> service.excluir("cliente.demo"));
        verify(pedidos, never()).deleteByClienteId(anyLong());
    }

    @Test
    void apagaPedidosEUsuarioQuandoNaoHaContrato() {
        when(usuarios.findByUsername("cliente.demo")).thenReturn(Optional.of(usuario));
        when(pedidos.existsByClienteIdAndStatus(1L, StatusPedido.CONTRATO_EXECUTADO)).thenReturn(false);

        service.excluir("cliente.demo");

        verify(pedidos).deleteByClienteId(1L);
        verify(usuarios).delete(usuario);
    }
}
