package br.com.aluguelcarro.model;

/** Ciclo de vida de um pedido de aluguel. */
public enum StatusPedido {
    EM_ANALISE,
    APROVADO_FINANCEIRAMENTE,
    REPROVADO,
    CONTRATO_EXECUTADO,
    CANCELADO;

    public boolean isFinal() {
        return this == CONTRATO_EXECUTADO || this == CANCELADO;
    }
}
