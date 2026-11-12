package br.com.aluguelcarro.service;

import br.com.aluguelcarro.dto.Dtos.AutomovelRequest;
import br.com.aluguelcarro.dto.Dtos.AutomovelResponse;
import br.com.aluguelcarro.exception.RecursoNaoEncontradoException;
import br.com.aluguelcarro.exception.RegraNegocioException;
import br.com.aluguelcarro.model.Automovel;
import br.com.aluguelcarro.repository.AutomovelRepository;
import br.com.aluguelcarro.repository.PedidoAluguelRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AutomovelService {

    private final AutomovelRepository automoveis;
    private final PedidoAluguelRepository pedidos;

    public AutomovelService(AutomovelRepository automoveis, PedidoAluguelRepository pedidos) {
        this.automoveis = automoveis;
        this.pedidos = pedidos;
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listar() {
        return automoveis.findAll().stream().map(Mapeador::paraResponse).toList();
    }

    @Transactional
    public AutomovelResponse criar(AutomovelRequest req) {
        if (automoveis.existsByPlaca(req.placa())) {
            throw new RegraNegocioException("Já existe um automóvel com esta placa");
        }
        if (automoveis.existsByMatricula(req.matricula())) {
            throw new RegraNegocioException("Já existe um automóvel com esta matrícula");
        }
        Automovel a = new Automovel();
        copiar(a, req);
        return Mapeador.paraResponse(automoveis.save(a));
    }

    @Transactional
    public AutomovelResponse atualizar(Long id, AutomovelRequest req) {
        Automovel a = obter(id);
        if (automoveis.existsByPlacaAndIdNot(req.placa(), id)) {
            throw new RegraNegocioException("Já existe um automóvel com esta placa");
        }
        if (automoveis.existsByMatriculaAndIdNot(req.matricula(), id)) {
            throw new RegraNegocioException("Já existe um automóvel com esta matrícula");
        }
        copiar(a, req);
        return Mapeador.paraResponse(a);
    }

    @Transactional
    public void excluir(Long id) {
        Automovel a = obter(id);
        if (pedidos.existsByAutomovelId(id)) {
            throw new RegraNegocioException("Automóvel está vinculado a pedidos de aluguel");
        }
        automoveis.delete(a);
    }

    Automovel obter(Long id) {
        return automoveis.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Automóvel não encontrado"));
    }

    private void copiar(Automovel a, AutomovelRequest req) {
        a.setMatricula(req.matricula());
        a.setAno(req.ano());
        a.setMarca(req.marca());
        a.setModelo(req.modelo());
        a.setPlaca(req.placa().toUpperCase());
        a.setValorDiaria(req.valorDiaria());
        a.setTipoProprietario(req.tipoProprietario());
    }
}
