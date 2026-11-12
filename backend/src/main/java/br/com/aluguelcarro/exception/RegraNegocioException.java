package br.com.aluguelcarro.exception;

/** Violação de regra de negócio (dados inconsistentes ou transição de status inválida). */
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
