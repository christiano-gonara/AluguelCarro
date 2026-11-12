package br.com.aluguelcarro.service;

import br.com.aluguelcarro.dto.Dtos.RegistroRequest;
import br.com.aluguelcarro.dto.Dtos.UsuarioResponse;
import br.com.aluguelcarro.exception.RecursoNaoEncontradoException;
import br.com.aluguelcarro.exception.RegraNegocioException;
import br.com.aluguelcarro.model.Cliente;
import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.Usuario;
import br.com.aluguelcarro.repository.ClienteRepository;
import br.com.aluguelcarro.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final ClienteRepository clientes;
    private final ClienteService clienteService;
    private final PasswordEncoder encoder;

    public UsuarioService(UsuarioRepository usuarios, ClienteRepository clientes,
                          ClienteService clienteService, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.clientes = clientes;
        this.clienteService = clienteService;
        this.encoder = encoder;
    }

    /** Cadastro prévio: só clientes se cadastram sozinhos. Agentes são criados pela administração. */
    @Transactional
    public UsuarioResponse registrar(RegistroRequest req) {
        if (usuarios.existsByUsername(req.username())) {
            throw new RegraNegocioException("Nome de usuário já está em uso");
        }
        if (clientes.existsByCpf(req.cliente().cpf())) {
            throw new RegraNegocioException("Já existe um cliente com este CPF");
        }
        Cliente cliente = new Cliente();
        clienteService.aplicar(cliente, req.cliente());

        Usuario usuario = new Usuario(req.username(), encoder.encode(req.senha()), Perfil.CLIENTE);
        usuario.setCliente(cliente);
        usuarios.save(usuario);
        return paraResponse(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscar(String username) {
        return paraResponse(obter(username));
    }

    @Transactional(readOnly = true)
    public Usuario obter(String username) {
        return usuarios.findByUsername(username)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário não encontrado"));
    }

    private UsuarioResponse paraResponse(Usuario u) {
        Long clienteId = u.getCliente() == null ? null : u.getCliente().getId();
        return new UsuarioResponse(u.getUsername(), u.getPerfil(), clienteId);
    }
}
