package br.com.aluguelcarro.exception;

/** Usuário autenticado tentando acessar ou alterar algo que não é dele. */
public class AcessoNegadoException extends RuntimeException {

    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
