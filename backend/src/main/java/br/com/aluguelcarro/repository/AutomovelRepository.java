package br.com.aluguelcarro.repository;

import br.com.aluguelcarro.model.Automovel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    boolean existsByPlaca(String placa);

    boolean existsByMatricula(String matricula);

    boolean existsByPlacaAndIdNot(String placa, Long id);

    boolean existsByMatriculaAndIdNot(String matricula, Long id);
}
