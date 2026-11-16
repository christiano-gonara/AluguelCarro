package br.com.aluguelcarro.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import br.com.aluguelcarro.dto.Dtos.AvaliacaoRequest;
import br.com.aluguelcarro.dto.Dtos.CreditoRequest;
import br.com.aluguelcarro.dto.Dtos.ExecucaoRequest;
import br.com.aluguelcarro.dto.Dtos.PedidoRequest;
import br.com.aluguelcarro.dto.Dtos.PedidoResponse;
import br.com.aluguelcarro.exception.AcessoNegadoException;
import br.com.aluguelcarro.exception.RegraNegocioException;
import br.com.aluguelcarro.model.Automovel;
import br.com.aluguelcarro.model.Cliente;
import br.com.aluguelcarro.model.PedidoAluguel;
import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.StatusPedido;
import br.com.aluguelcarro.model.TipoProprietario;
import br.com.aluguelcarro.repository.PedidoAluguelRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoAluguelRepository pedidos;

    @Mock
    private UsuarioService usuarios;

    @Mock
    private AutomovelService automoveis;

    private PedidoService service;
    private Cliente dono;
    private Automovel carro;

    @BeforeEach
    void preparar() {
        service = new PedidoService(pedidos, usuarios, automoveis);
        dono = Fixtures.cliente(1L, "Cliente de Demonstração");
        carro = Fixtures.automovel(1L, "100.00");
    }

    @Test
    void clienteCriaPedidoEmAnaliseComValorEstimado() {
        when(usuarios.obter("cliente.demo")).thenReturn(Fixtures.clienteUsuario("cliente.demo", dono));
        when(automoveis.obter(1L)).thenReturn(carro);
        when(pedidos.save(any(PedidoAluguel.class))).thenAnswer(chamada -> chamada.getArgument(0));

        PedidoResponse resposta = service.criar("cliente.demo",
                new PedidoRequest(1L, LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 3)));

        assertEquals(StatusPedido.EM_ANALISE, resposta.status());
        assertEquals(0, new BigDecimal("300.00").compareTo(resposta.valorTotalEstimado()));
    }

    @Test
    void agenteNaoPodeIntroduzirPedido() {
        when(usuarios.obter("agente.empresa"))
                .thenReturn(Fixtures.agente("agente.empresa", Perfil.AGENTE_EMPRESA));

        assertThrows(AcessoNegadoException.class, () -> service.criar("agente.empresa",
                new PedidoRequest(1L, LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 3))));
    }

    @Test
    void pedidoComDevolucaoAntesDaRetiradaEFechado() {
        when(usuarios.obter("cliente.demo")).thenReturn(Fixtures.clienteUsuario("cliente.demo", dono));

        assertThrows(RegraNegocioException.class, () -> service.criar("cliente.demo",
                new PedidoRequest(1L, LocalDate.of(2026, 12, 5), LocalDate.of(2026, 12, 4))));
    }

    @Test
    void clienteNaoPodeAbrirPedidoDeOutraConta() {
        Cliente marina = Fixtures.cliente(2L, "Marina Souza");
        when(usuarios.obter("cliente.demo")).thenReturn(Fixtures.clienteUsuario("cliente.demo", dono));
        when(pedidos.findById(6L)).thenReturn(Optional.of(Fixtures.pedido(6L, marina, carro, StatusPedido.EM_ANALISE)));

        assertThrows(AcessoNegadoException.class, () -> service.buscar("cliente.demo", 6L));
    }

    @Test
    void clienteModificaPedidoEmAnalise() {
        PedidoAluguel pedido = Fixtures.pedido(1L, dono, carro, StatusPedido.EM_ANALISE);
        Automovel outro = Fixtures.automovel(2L, "170.00");
        when(usuarios.obter("cliente.demo")).thenReturn(Fixtures.clienteUsuario("cliente.demo", dono));
        when(pedidos.findById(1L)).thenReturn(Optional.of(pedido));
        when(automoveis.obter(2L)).thenReturn(outro);

        PedidoResponse resposta = service.modificar("cliente.demo", 1L,
                new PedidoRequest(2L, LocalDate.of(2026, 12, 5), LocalDate.of(2026, 12, 8)));

        assertEquals(2L, resposta.automovel().id());
        assertEquals(0, new BigDecimal("680.00").compareTo(resposta.valorTotalEstimado()));
    }

    @Test
    void clienteNaoPodeModificarPedidoJaAvaliado() {
        PedidoAluguel pedido = Fixtures.pedido(2L, dono, carro, StatusPedido.APROVADO_FINANCEIRAMENTE);
        when(usuarios.obter("cliente.demo")).thenReturn(Fixtures.clienteUsuario("cliente.demo", dono));
        when(pedidos.findById(2L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class, () -> service.modificar("cliente.demo", 2L,
                new PedidoRequest(1L, LocalDate.of(2026, 12, 5), LocalDate.of(2026, 12, 8))));
    }

    @Test
    void clienteCancelaPedidoEmAnalise() {
        PedidoAluguel pedido = Fixtures.pedido(1L, dono, carro, StatusPedido.EM_ANALISE);
        when(usuarios.obter("cliente.demo")).thenReturn(Fixtures.clienteUsuario("cliente.demo", dono));
        when(pedidos.findById(1L)).thenReturn(Optional.of(pedido));

        assertEquals(StatusPedido.CANCELADO, service.cancelar("cliente.demo", 1L).status());
    }

    @Test
    void agenteNaoPodeCancelarPedidoDoCliente() {
        when(usuarios.obter("agente.empresa"))
                .thenReturn(Fixtures.agente("agente.empresa", Perfil.AGENTE_EMPRESA));
        when(pedidos.findById(1L)).thenReturn(Optional.of(Fixtures.pedido(1L, dono, carro, StatusPedido.EM_ANALISE)));

        assertThrows(AcessoNegadoException.class, () -> service.cancelar("agente.empresa", 1L));
    }

    @Test
    void agenteAprovaEParecerFicaComSeuNome() {
        PedidoAluguel pedido = Fixtures.pedido(1L, dono, carro, StatusPedido.EM_ANALISE);
        when(usuarios.obter("agente.empresa"))
                .thenReturn(Fixtures.agente("agente.empresa", Perfil.AGENTE_EMPRESA));
        when(pedidos.findById(1L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = service.avaliar("agente.empresa", 1L, new AvaliacaoRequest(true, "Renda compatível"));

        assertEquals(StatusPedido.APROVADO_FINANCEIRAMENTE, resposta.status());
        assertEquals("Renda compatível (agente.empresa)", resposta.parecer());
    }

    @Test
    void bancoExecutaContratoComParcelamento() {
        PedidoAluguel pedido = Fixtures.pedido(2L, dono, carro, StatusPedido.APROVADO_FINANCEIRAMENTE);
        when(usuarios.obter("agente.banco")).thenReturn(Fixtures.agente("agente.banco", Perfil.AGENTE_BANCO));
        when(pedidos.findById(2L)).thenReturn(Optional.of(pedido));

        PedidoResponse resposta = service.executar("agente.banco", 2L, new ExecucaoRequest(
                TipoProprietario.CLIENTE,
                new CreditoRequest(new BigDecimal("5000.00"), new BigDecimal("1.900"), 12)));

        assertEquals(StatusPedido.CONTRATO_EXECUTADO, resposta.status());
        assertEquals(TipoProprietario.CLIENTE, resposta.propriedadeRegistrada());
        assertNotNull(resposta.credito());
        assertEquals("agente.banco", resposta.credito().banco());
    }

    @Test
    void empresaNaoPodeConcederContratoDeCredito() {
        PedidoAluguel pedido = Fixtures.pedido(2L, dono, carro, StatusPedido.APROVADO_FINANCEIRAMENTE);
        when(usuarios.obter("agente.empresa"))
                .thenReturn(Fixtures.agente("agente.empresa", Perfil.AGENTE_EMPRESA));
        when(pedidos.findById(2L)).thenReturn(Optional.of(pedido));

        assertThrows(AcessoNegadoException.class, () -> service.executar("agente.empresa", 2L,
                new ExecucaoRequest(TipoProprietario.EMPRESA,
                        new CreditoRequest(new BigDecimal("5000.00"), new BigDecimal("1.900"), 12))));
        assertEquals(StatusPedido.APROVADO_FINANCEIRAMENTE, pedido.getStatus());
    }

    @Test
    void contratoSoDepoisDoParecerPositivo() {
        PedidoAluguel pedido = Fixtures.pedido(1L, dono, carro, StatusPedido.EM_ANALISE);
        when(usuarios.obter("agente.banco")).thenReturn(Fixtures.agente("agente.banco", Perfil.AGENTE_BANCO));
        when(pedidos.findById(1L)).thenReturn(Optional.of(pedido));

        assertThrows(RegraNegocioException.class, () -> service.executar("agente.banco", 1L,
                new ExecucaoRequest(TipoProprietario.BANCO, null)));
    }
}
