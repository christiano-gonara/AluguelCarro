package br.com.aluguelcarro.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

class PedidoAluguelTest {

    private Automovel carro(String diaria) {
        Automovel a = new Automovel();
        a.setValorDiaria(new BigDecimal(diaria));
        return a;
    }

    @Test
    void valorEstimadoContaInicioEFimComoDiarias() {
        PedidoAluguel p = new PedidoAluguel(new Cliente(), carro("100.00"),
                LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 3));
        assertEquals(0, new BigDecimal("300.00").compareTo(p.valorTotalEstimado()));
    }

    @Test
    void novoPedidoComecaEmAnalise() {
        PedidoAluguel p = new PedidoAluguel(new Cliente(), carro("100.00"),
                LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 1));
        assertEquals(StatusPedido.EM_ANALISE, p.getStatus());
    }

    @Test
    void clienteAceitaNoMaximoTresEmpregadores() {
        Cliente c = new Cliente();
        List<Empregador> quatro = List.of(
                new Empregador("A", BigDecimal.ONE), new Empregador("B", BigDecimal.ONE),
                new Empregador("C", BigDecimal.ONE), new Empregador("D", BigDecimal.ONE));
        assertThrows(IllegalArgumentException.class, () -> c.substituirEmpregadores(quatro));
    }

    @Test
    void rendimentoTotalSomaOsEmpregadores() {
        Cliente c = new Cliente();
        c.substituirEmpregadores(List.of(
                new Empregador("A", new BigDecimal("1500.00")), new Empregador("B", new BigDecimal("500.50"))));
        assertEquals(0, new BigDecimal("2000.50").compareTo(c.rendimentoTotal()));
    }
}
