package br.com.aluguelcarro.repository;

import br.com.aluguelcarro.model.PedidoAluguel;
import br.com.aluguelcarro.model.StatusPedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoAluguelRepository extends JpaRepository<PedidoAluguel, Long> {

    List<PedidoAluguel> findByClienteIdOrderByCriadoEmDesc(Long clienteId);

    List<PedidoAluguel> findAllByOrderByCriadoEmDesc();

    boolean existsByAutomovelId(Long automovelId);

    boolean existsByClienteIdAndStatus(Long clienteId, StatusPedido status);

    void deleteByClienteId(Long clienteId);
}
