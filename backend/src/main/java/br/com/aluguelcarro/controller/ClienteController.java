package br.com.aluguelcarro.controller;

import br.com.aluguelcarro.dto.Dtos.ClienteRequest;
import br.com.aluguelcarro.dto.Dtos.ClienteResponse;
import br.com.aluguelcarro.service.ClienteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** CRUD de cliente (o "C" acontece em POST /api/auth/registro). */
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse meuCadastro(Authentication authentication) {
        return service.buscarDoUsuario(authentication.getName());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CLIENTE')")
    public ClienteResponse atualizar(Authentication authentication, @Valid @RequestBody ClienteRequest req) {
        return service.atualizar(authentication.getName(), req);
    }

    @DeleteMapping("/me")
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(Authentication authentication) {
        service.excluir(authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    public List<ClienteResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    public ClienteResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }
}
