package br.com.aluguelcarro.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/** Contrato de crédito associado a um aluguel, concedido por um banco agente. */
@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "banco_id")
    private Usuario banco;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal valor;

    @Column(name = "taxa_juros_mensal", nullable = false, precision = 6, scale = 3)
    private BigDecimal taxaJurosMensal;

    @Column(nullable = false)
    private Integer parcelas;

    protected ContratoCredito() {
    }

    public ContratoCredito(Usuario banco, BigDecimal valor, BigDecimal taxaJurosMensal, Integer parcelas) {
        this.banco = banco;
        this.valor = valor;
        this.taxaJurosMensal = taxaJurosMensal;
        this.parcelas = parcelas;
    }

    public Long getId() { return id; }
    public Usuario getBanco() { return banco; }
    public BigDecimal getValor() { return valor; }
    public BigDecimal getTaxaJurosMensal() { return taxaJurosMensal; }
    public Integer getParcelas() { return parcelas; }
}
