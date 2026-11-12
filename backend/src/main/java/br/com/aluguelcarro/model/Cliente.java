package br.com.aluguelcarro.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/** Contratante do aluguel: identificação, profissão e até 3 empregadores com rendimentos. */
@Entity
@Table(name = "clientes")
public class Cliente {

    public static final int MAX_EMPREGADORES = 3;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String profissao;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Empregador> empregadores = new ArrayList<>();

    public Long getId() { return id; }
    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getProfissao() { return profissao; }
    public void setProfissao(String profissao) { this.profissao = profissao; }
    public List<Empregador> getEmpregadores() { return empregadores; }

    /** Substitui a lista de empregadores respeitando o limite de 3. */
    public void substituirEmpregadores(List<Empregador> novos) {
        if (novos.size() > MAX_EMPREGADORES) {
            throw new IllegalArgumentException("Máximo de " + MAX_EMPREGADORES + " empregadores");
        }
        empregadores.clear();
        for (Empregador e : novos) {
            e.setCliente(this);
            empregadores.add(e);
        }
    }

    public BigDecimal rendimentoTotal() {
        return empregadores.stream()
                .map(Empregador::getRendimento)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
