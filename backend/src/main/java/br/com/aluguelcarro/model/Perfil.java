package br.com.aluguelcarro.model;

/** Perfis de acesso: cliente individual ou agente (empresa ou banco). */
public enum Perfil {
    CLIENTE,
    AGENTE_EMPRESA,
    AGENTE_BANCO;

    public boolean isAgente() {
        return this != CLIENTE;
    }
}
