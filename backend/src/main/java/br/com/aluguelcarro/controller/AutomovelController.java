package br.com.aluguelcarro.controller;

import br.com.aluguelcarro.dto.Dtos.AutomovelRequest;
import br.com.aluguelcarro.dto.Dtos.AutomovelResponse;
import br.com.aluguelcarro.service.AutomovelService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/automoveis")
public class AutomovelController {

    private final AutomovelService service;

    public AutomovelController(AutomovelService service) {
        this.service = service;
    }

    /** Qualquer usuário autenticado consulta o catálogo. */
    @GetMapping
    public List<AutomovelResponse> listar() {
        return service.listar();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    @ResponseStatus(HttpStatus.CREATED)
    public AutomovelResponse criar(@Valid @RequestBody AutomovelRequest req) {
        return service.criar(req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    public AutomovelResponse atualizar(@PathVariable Long id, @Valid @RequestBody AutomovelRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('AGENTE_EMPRESA','AGENTE_BANCO')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
