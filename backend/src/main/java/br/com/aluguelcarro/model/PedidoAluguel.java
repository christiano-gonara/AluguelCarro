package br.com.aluguelcarro.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "pedidos_aluguel")
public class PedidoAluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "automovel_id")
    private Automovel automovel;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusPedido status = StatusPedido.EM_ANALISE;

    /** Parecer financeiro registrado pelo agente na avaliação. */
    @Column(length = 1000)
    private String parecer;

    /** Definido na execução do contrato: em nome de quem o automóvel é registrado. */
    @Enumerated(EnumType.STRING)
    @Column(name = "propriedade_registrada", length = 20)
    private TipoProprietario propriedadeRegistrada;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    protected PedidoAluguel() {
    }

    public PedidoAluguel(Cliente cliente, Automovel automovel, LocalDate dataInicio, LocalDate dataFim) {
        this.cliente = cliente;
        this.automovel = automovel;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
    }

    /** Valor estimado: diárias (início e fim inclusos) vezes o valor da diária. */
    public BigDecimal valorTotalEstimado() {
        long dias = ChronoUnit.DAYS.between(dataInicio, dataFim) + 1;
        return automovel.getValorDiaria().multiply(BigDecimal.valueOf(dias));
    }

    public void tocar() {
        this.atualizadoEm = Instant.now();
    }

    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public Automovel getAutomovel() { return automovel; }
    public void setAutomovel(Automovel automovel) { this.automovel = automovel; }
    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public void setDataFim(LocalDate dataFim) { this.dataFim = dataFim; }
    public StatusPedido getStatus() { return status; }
    public void setStatus(StatusPedido status) { this.status = status; }
    public String getParecer() { return parecer; }
    public void setParecer(String parecer) { this.parecer = parecer; }
    public TipoProprietario getPropriedadeRegistrada() { return propriedadeRegistrada; }
    public void setPropriedadeRegistrada(TipoProprietario p) { this.propriedadeRegistrada = p; }
    public ContratoCredito getContratoCredito() { return contratoCredito; }
    public void setContratoCredito(ContratoCredito c) { this.contratoCredito = c; }
    public Instant getCriadoEm() { return criadoEm; }
    public Instant getAtualizadoEm() { return atualizadoEm; }
}
