package br.com.aluguelcarro.repository;

import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByPerfil(Perfil perfil);
}
