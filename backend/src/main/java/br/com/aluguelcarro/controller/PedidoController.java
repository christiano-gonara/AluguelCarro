package br.com.aluguelcarro.controller;

import br.com.aluguelcarro.dto.Dtos.AvaliacaoRequest;
import br.com.aluguelcarro.dto.Dtos.ExecucaoRequest;
import br.com.aluguelcarro.dto.Dtos.PedidoRequest;
import br.com.aluguelcarro.dto.Dtos.PedidoResponse;
import br.com.aluguelcarro.service.PedidoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(Authentication authentication, @Valid @RequestBody PedidoRequest req) {
        return service.criar(authentication.getName(), req);
    }

    /** Cliente vê os próprios pedidos; agentes veem todos. */
    @GetMapping
    public List<PedidoResponse> listar(Authentication authentication) {
        return service.listar(authentication.getName());
    }

    @GetMapping("/{id}")
    public PedidoResponse buscar(Authentication authentication, @PathVariable Long id) {
        return service.buscar(authentication.getName(), id);
    }

    @PutMapping("/{id}")
    public PedidoResponse modificar(Authentication authentication, @PathVariable Long id,
                                    @Valid @RequestBody PedidoRequest req) {
        return service.modificar(authentication.getName(), id, req);
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('CLIENTE')")
    public PedidoResponse cancelar(Authentication authentication, @PathVariable Long id) {
        return service.cancelar(authentication.getName(), id);
    }

    @PostMapping("/{id}/avaliar")
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    public PedidoResponse avaliar(Authentication authentication, @PathVariable Long id,
                                  @Valid @RequestBody AvaliacaoRequest req) {
        return service.avaliar(authentication.getName(), id, req);
    }

    @PostMapping("/{id}/executar")
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    public PedidoResponse executar(Authentication authentication, @PathVariable Long id,
                                   @Valid @RequestBody ExecucaoRequest req) {
        return service.executar(authentication.getName(), id, req);
    }
}
