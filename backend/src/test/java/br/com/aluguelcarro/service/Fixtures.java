package br.com.aluguelcarro.service;

import br.com.aluguelcarro.dto.Dtos.ClienteRequest;
import br.com.aluguelcarro.dto.Dtos.EmpregadorDto;
import br.com.aluguelcarro.model.Automovel;
import br.com.aluguelcarro.model.Cliente;
import br.com.aluguelcarro.model.PedidoAluguel;
import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.StatusPedido;
import br.com.aluguelcarro.model.TipoProprietario;
import br.com.aluguelcarro.model.Usuario;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.test.util.ReflectionTestUtils;

/** Objetos de domínio prontos para os testes de service. */
final class Fixtures {

    private Fixtures() {
    }

    static Cliente cliente(long id, String nome) {
        Cliente c = new Cliente();
        ReflectionTestUtils.setField(c, "id", id);
        c.setRg("MG-12.345.678");
        c.setCpf("12345678909");
        c.setNome(nome);
        c.setEndereco("Rua das Acácias, 120");
        c.setProfissao("Analista de sistemas");
        return c;
    }

    static Automovel automovel(long id, String diaria) {
        Automovel a = new Automovel();
        ReflectionTestUtils.setField(a, "id", id);
        a.setMatricula("MAT-" + id);
        a.setAno(2024);
        a.setMarca("Fiat");
        a.setModelo("Argo");
        a.setPlaca("ABC1D23");
        a.setValorDiaria(new BigDecimal(diaria));
        a.setTipoProprietario(TipoProprietario.EMPRESA);
        return a;
    }

    static Usuario clienteUsuario(String username, Cliente cliente) {
        Usuario u = new Usuario(username, "hash", Perfil.CLIENTE);
        u.setCliente(cliente);
        return u;
    }

    static Usuario agente(String username, Perfil perfil) {
        return new Usuario(username, "hash", perfil);
    }

    static PedidoAluguel pedido(long id, Cliente cliente, Automovel automovel, StatusPedido status) {
        PedidoAluguel p = new PedidoAluguel(
                cliente, automovel, LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 3));
        ReflectionTestUtils.setField(p, "id", id);
        p.setStatus(status);
        return p;
    }

    static ClienteRequest clienteRequest(String cpf, String nome, EmpregadorDto... empregadores) {
        return new ClienteRequest(
                "MG-12.345.678", cpf, nome, "Rua das Acácias, 120", "Analista de sistemas", List.of(empregadores));
    }
}
