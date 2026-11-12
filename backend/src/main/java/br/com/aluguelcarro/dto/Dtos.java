package br.com.aluguelcarro.dto;

import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.StatusPedido;
import br.com.aluguelcarro.model.TipoProprietario;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/** Objetos de transferência de dados (entrada e saída da API). */
public final class Dtos {

    private Dtos() {
    }

    // ---------- Autenticação ----------

    public record LoginRequest(
            @NotBlank String username,
            @NotBlank String senha) {
    }

    public record RegistroRequest(
            @NotBlank @Size(min = 3, max = 60) String username,
            @NotBlank @Size(min = 6, max = 72) String senha,
            @NotNull @Valid ClienteRequest cliente) {
    }

    public record UsuarioResponse(String username, Perfil perfil, Long clienteId) {
    }

    // ---------- Cliente ----------

    public record EmpregadorDto(
            @NotBlank String entidade,
            @NotNull @DecimalMin("0.00") BigDecimal rendimento) {
    }

    public record ClienteRequest(
            @NotBlank @Size(max = 20) String rg,
            @NotBlank @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos numéricos") String cpf,
            @NotBlank String nome,
            @NotBlank String endereco,
            @NotBlank String profissao,
            @NotNull @Size(max = 3, message = "Máximo de 3 empregadores") List<@Valid EmpregadorDto> empregadores) {
    }

    public record ClienteResponse(
            Long id,
            String rg,
            String cpf,
            String nome,
            String endereco,
            String profissao,
            List<EmpregadorDto> empregadores,
            BigDecimal rendimentoTotal) {
    }

    // ---------- Automóvel ----------

    public record AutomovelRequest(
            @NotBlank String matricula,
            @NotNull @Min(1980) @Max(2100) Integer ano,
            @NotBlank String marca,
            @NotBlank String modelo,
            @NotBlank @Size(max = 10) String placa,
            @NotNull @DecimalMin("0.01") BigDecimal valorDiaria,
            @NotNull TipoProprietario tipoProprietario) {
    }

    public record AutomovelResponse(
            Long id,
            String matricula,
            Integer ano,
            String marca,
            String modelo,
            String placa,
            BigDecimal valorDiaria,
            TipoProprietario tipoProprietario) {
    }

    // ---------- Pedido de aluguel ----------

    public record PedidoRequest(
            @NotNull Long automovelId,
            @NotNull @FutureOrPresent LocalDate dataInicio,
            @NotNull LocalDate dataFim) {
    }

    public record AvaliacaoRequest(
            @NotNull Boolean aprovado,
            @NotBlank @Size(max = 1000) String parecer) {
    }

    public record CreditoRequest(
            @NotNull @DecimalMin("0.01") BigDecimal valor,
            @NotNull @DecimalMin("0.00") BigDecimal taxaJurosMensal,
            @NotNull @Min(1) @Max(120) Integer parcelas) {
    }

    public record ExecucaoRequest(
            @NotNull TipoProprietario propriedade,
            @Valid CreditoRequest credito) {
    }

    public record CreditoResponse(
            String banco,
            BigDecimal valor,
            BigDecimal taxaJurosMensal,
            Integer parcelas) {
    }

    public record PedidoResponse(
            Long id,
            Long clienteId,
            String clienteNome,
            BigDecimal clienteRendimentoTotal,
            AutomovelResponse automovel,
            LocalDate dataInicio,
            LocalDate dataFim,
            BigDecimal valorTotalEstimado,
            StatusPedido status,
            String parecer,
            TipoProprietario propriedadeRegistrada,
            CreditoResponse credito,
            Instant criadoEm,
            Instant atualizadoEm) {
    }

    // ---------- Erros ----------

    public record ErroResponse(String mensagem, List<String> detalhes) {
    }
}
