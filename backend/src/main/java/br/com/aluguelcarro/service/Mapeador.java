package br.com.aluguelcarro.service;

import br.com.aluguelcarro.dto.Dtos.AutomovelResponse;
import br.com.aluguelcarro.dto.Dtos.ClienteResponse;
import br.com.aluguelcarro.dto.Dtos.CreditoResponse;
import br.com.aluguelcarro.dto.Dtos.EmpregadorDto;
import br.com.aluguelcarro.dto.Dtos.PedidoResponse;
import br.com.aluguelcarro.model.Automovel;
import br.com.aluguelcarro.model.Cliente;
import br.com.aluguelcarro.model.ContratoCredito;
import br.com.aluguelcarro.model.PedidoAluguel;

/** Conversões entre entidades (Model) e DTOs. Deve ser chamado dentro de uma transação. */
final class Mapeador {

    private Mapeador() {
    }

    static ClienteResponse paraResponse(Cliente c) {
        return new ClienteResponse(
                c.getId(), c.getRg(), c.getCpf(), c.getNome(), c.getEndereco(), c.getProfissao(),
                c.getEmpregadores().stream()
                        .map(e -> new EmpregadorDto(e.getEntidade(), e.getRendimento()))
                        .toList(),
                c.rendimentoTotal());
    }

    static AutomovelResponse paraResponse(Automovel a) {
        return new AutomovelResponse(
                a.getId(), a.getMatricula(), a.getAno(), a.getMarca(), a.getModelo(),
                a.getPlaca(), a.getValorDiaria(), a.getTipoProprietario());
    }

    static PedidoResponse paraResponse(PedidoAluguel p) {
        ContratoCredito cc = p.getContratoCredito();
        CreditoResponse credito = cc == null ? null
                : new CreditoResponse(cc.getBanco().getUsername(), cc.getValor(), cc.getTaxaJurosMensal(), cc.getParcelas());
        return new PedidoResponse(
                p.getId(),
                p.getCliente().getId(),
                p.getCliente().getNome(),
                p.getCliente().rendimentoTotal(),
                paraResponse(p.getAutomovel()),
                p.getDataInicio(),
                p.getDataFim(),
                p.valorTotalEstimado(),
                p.getStatus(),
                p.getParecer(),
                p.getPropriedadeRegistrada(),
                credito,
                p.getCriadoEm(),
                p.getAtualizadoEm());
    }
}
