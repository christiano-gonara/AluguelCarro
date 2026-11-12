package br.com.aluguelcarro.service;

import br.com.aluguelcarro.dto.Dtos.AvaliacaoRequest;
import br.com.aluguelcarro.dto.Dtos.ExecucaoRequest;
import br.com.aluguelcarro.dto.Dtos.PedidoRequest;
import br.com.aluguelcarro.dto.Dtos.PedidoResponse;
import br.com.aluguelcarro.exception.AcessoNegadoException;
import br.com.aluguelcarro.exception.RecursoNaoEncontradoException;
import br.com.aluguelcarro.exception.RegraNegocioException;
import br.com.aluguelcarro.model.ContratoCredito;
import br.com.aluguelcarro.model.PedidoAluguel;
import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.StatusPedido;
import br.com.aluguelcarro.model.Usuario;
import br.com.aluguelcarro.repository.PedidoAluguelRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Regras dos pedidos de aluguel:
 * - clientes introduzem, modificam (enquanto em análise), consultam e cancelam os próprios pedidos;
 * - agentes (empresas e bancos) modificam e avaliam pedidos; só bancos anexam contrato de crédito.
 */
@Service
public class PedidoService {

    private final PedidoAluguelRepository pedidos;
    private final UsuarioService usuarios;
    private final AutomovelService automoveis;

    public PedidoService(PedidoAluguelRepository pedidos, UsuarioService usuarios, AutomovelService automoveis) {
        this.pedidos = pedidos;
        this.usuarios = usuarios;
        this.automoveis = automoveis;
    }

    @Transactional
    public PedidoResponse criar(String username, PedidoRequest req) {
        Usuario usuario = usuarios.obter(username);
        if (usuario.getCliente() == null) {
            throw new AcessoNegadoException("Somente clientes podem introduzir pedidos");
        }
        validarPeriodo(req.dataInicio(), req.dataFim());
        PedidoAluguel pedido = new PedidoAluguel(
                usuario.getCliente(), automoveis.obter(req.automovelId()), req.dataInicio(), req.dataFim());
        return Mapeador.paraResponse(pedidos.save(pedido));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listar(String username) {
        Usuario usuario = usuarios.obter(username);
        List<PedidoAluguel> lista = usuario.getPerfil().isAgente()
                ? pedidos.findAllByOrderByCriadoEmDesc()
                : pedidos.findByClienteIdOrderByCriadoEmDesc(usuario.getCliente().getId());
        return lista.stream().map(Mapeador::paraResponse).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(String username, Long id) {
        Usuario usuario = usuarios.obter(username);
        PedidoAluguel pedido = obter(id);
        garantirAcesso(usuario, pedido);
        return Mapeador.paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse modificar(String username, Long id, PedidoRequest req) {
        Usuario usuario = usuarios.obter(username);
        PedidoAluguel pedido = obter(id);
        garantirAcesso(usuario, pedido);
        if (pedido.getStatus().isFinal()) {
            throw new RegraNegocioException("Pedido " + pedido.getStatus() + " não pode ser modificado");
        }
        if (!usuario.getPerfil().isAgente() && pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new RegraNegocioException("O cliente só pode modificar pedidos em análise");
        }
        validarPeriodo(req.dataInicio(), req.dataFim());
        pedido.setAutomovel(automoveis.obter(req.automovelId()));
        pedido.setDataInicio(req.dataInicio());
        pedido.setDataFim(req.dataFim());
        pedido.tocar();
        return Mapeador.paraResponse(pedido);
    }

    @Transactional
    public PedidoResponse cancelar(String username, Long id) {
        Usuario usuario = usuarios.obter(username);
        PedidoAluguel pedido = obter(id);
        if (usuario.getPerfil() != Perfil.CLIENTE) {
            throw new AcessoNegadoException("Somente o cliente pode cancelar o pedido");
        }
        garantirAcesso(usuario, pedido);
        if (pedido.getStatus().isFinal()) {
            throw new RegraNegocioException("Pedido já está " + pedido.getStatus());
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        pedido.tocar();
        return Mapeador.paraResponse(pedido);
    }

    /** Análise financeira feita por um agente. */
    @Transactional
    public PedidoResponse avaliar(String username, Long id, AvaliacaoRequest req) {
        Usuario agente = exigirAgente(username);
        PedidoAluguel pedido = obter(id);
        if (pedido.getStatus() != StatusPedido.EM_ANALISE) {
            throw new RegraNegocioException("Somente pedidos em análise podem ser avaliados");
        }
        pedido.setStatus(req.aprovado() ? StatusPedido.APROVADO_FINANCEIRAMENTE : StatusPedido.REPROVADO);
        pedido.setParecer(req.parecer() + " (" + agente.getUsername() + ")");
        pedido.tocar();
        return Mapeador.paraResponse(pedido);
    }

    /** Execução do contrato após parecer financeiro positivo. */
    @Transactional
    public PedidoResponse executar(String username, Long id, ExecucaoRequest req) {
        Usuario agente = exigirAgente(username);
        PedidoAluguel pedido = obter(id);
        if (pedido.getStatus() != StatusPedido.APROVADO_FINANCEIRAMENTE) {
            throw new RegraNegocioException("O contrato só pode ser executado após parecer financeiro positivo");
        }
        if (req.credito() != null) {
            if (agente.getPerfil() != Perfil.AGENTE_BANCO) {
                throw new AcessoNegadoException("Somente bancos podem conceder contrato de crédito");
            }
            pedido.setContratoCredito(new ContratoCredito(
                    agente, req.credito().valor(), req.credito().taxaJurosMensal(), req.credito().parcelas()));
        }
        pedido.setPropriedadeRegistrada(req.propriedade());
        pedido.setStatus(StatusPedido.CONTRATO_EXECUTADO);
        pedido.tocar();
        return Mapeador.paraResponse(pedido);
    }

    private PedidoAluguel obter(Long id) {
        return pedidos.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado"));
    }

    private Usuario exigirAgente(String username) {
        Usuario usuario = usuarios.obter(username);
        if (!usuario.getPerfil().isAgente()) {
            throw new AcessoNegadoException("Somente agentes podem realizar esta operação");
        }
        return usuario;
    }

    private void garantirAcesso(Usuario usuario, PedidoAluguel pedido) {
        if (usuario.getPerfil().isAgente()) {
            return;
        }
        if (usuario.getCliente() == null || !pedido.getCliente().getId().equals(usuario.getCliente().getId())) {
            throw new AcessoNegadoException("Este pedido pertence a outro cliente");
        }
    }

    private void validarPeriodo(LocalDate inicio, LocalDate fim) {
        if (fim.isBefore(inicio)) {
            throw new RegraNegocioException("A data final não pode ser anterior à data inicial");
        }
    }
}
