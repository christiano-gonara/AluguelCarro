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

/** Entidade empregadora do cliente e o respectivo rendimento. */
@Entity
@Table(name = "empregadores")
public class Empregador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Column(nullable = false)
    private String entidade;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal rendimento;

    protected Empregador() {
    }

    public Empregador(String entidade, BigDecimal rendimento) {
        this.entidade = entidade;
        this.rendimento = rendimento;
    }

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public String getEntidade() { return entidade; }
    public BigDecimal getRendimento() { return rendimento; }
}
