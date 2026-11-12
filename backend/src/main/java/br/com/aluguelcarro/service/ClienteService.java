package br.com.aluguelcarro.service;

import br.com.aluguelcarro.dto.Dtos.ClienteRequest;
import br.com.aluguelcarro.dto.Dtos.ClienteResponse;
import br.com.aluguelcarro.exception.RecursoNaoEncontradoException;
import br.com.aluguelcarro.exception.RegraNegocioException;
import br.com.aluguelcarro.model.Cliente;
import br.com.aluguelcarro.model.Empregador;
import br.com.aluguelcarro.model.StatusPedido;
import br.com.aluguelcarro.model.Usuario;
import br.com.aluguelcarro.repository.ClienteRepository;
import br.com.aluguelcarro.repository.PedidoAluguelRepository;
import br.com.aluguelcarro.repository.UsuarioRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CRUD de cliente. A criação acontece no cadastro (UsuarioService.registrar). */
@Service
public class ClienteService {

    private final ClienteRepository clientes;
    private final UsuarioRepository usuarios;
    private final PedidoAluguelRepository pedidos;

    public ClienteService(ClienteRepository clientes, UsuarioRepository usuarios, PedidoAluguelRepository pedidos) {
        this.clientes = clientes;
        this.usuarios = usuarios;
        this.pedidos = pedidos;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return clientes.findAll().stream().map(Mapeador::paraResponse).toList();
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscar(Long id) {
        return Mapeador.paraResponse(obter(id));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarDoUsuario(String username) {
        return Mapeador.paraResponse(clienteDe(username));
    }

    @Transactional
    public ClienteResponse atualizar(String username, ClienteRequest req) {
        Cliente cliente = clienteDe(username);
        if (clientes.existsByCpfAndIdNot(req.cpf(), cliente.getId())) {
            throw new RegraNegocioException("Já existe um cliente com este CPF");
        }
        aplicar(cliente, req);
        return Mapeador.paraResponse(cliente);
    }

    /** Exclui a conta do cliente e seus pedidos, desde que não haja contrato executado. */
    @Transactional
    public void excluir(String username) {
        Usuario usuario = usuarios.findByUsername(username)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
        Cliente cliente = usuario.getCliente();
        if (cliente == null) {
            throw new RegraNegocioException("Apenas clientes podem excluir o próprio cadastro");
        }
        if (pedidos.existsByClienteIdAndStatus(cliente.getId(), StatusPedido.CONTRATO_EXECUTADO)) {
            throw new RegraNegocioException("Não é possível excluir o cadastro: há contrato de aluguel executado");
        }
        pedidos.deleteByClienteId(cliente.getId());
        usuarios.delete(usuario);
    }

    /** Copia os dados da requisição para a entidade, validando CPF duplicado em novos cadastros. */
    void aplicar(Cliente cliente, ClienteRequest req) {
        cliente.setRg(req.rg());
        cliente.setCpf(req.cpf());
        cliente.setNome(req.nome());
        cliente.setEndereco(req.endereco());
        cliente.setProfissao(req.profissao());
        cliente.substituirEmpregadores(req.empregadores().stream()
                .map(e -> new Empregador(e.entidade(), e.rendimento()))
                .toList());
    }

    private Cliente obter(Long id) {
        return clientes.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));
    }

    private Cliente clienteDe(String username) {
        Usuario usuario = usuarios.findByUsername(username)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
        if (usuario.getCliente() == null) {
            throw new RecursoNaoEncontradoException("Este usuário não possui cadastro de cliente");
        }
        return usuario.getCliente();
    }
}
