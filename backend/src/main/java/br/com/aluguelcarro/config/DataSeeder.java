package br.com.aluguelcarro.config;

import br.com.aluguelcarro.model.Automovel;
import br.com.aluguelcarro.model.Perfil;
import br.com.aluguelcarro.model.TipoProprietario;
import br.com.aluguelcarro.model.Usuario;
import br.com.aluguelcarro.repository.AutomovelRepository;
import br.com.aluguelcarro.repository.UsuarioRepository;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria agentes (empresa e banco) e alguns automóveis para desenvolvimento.
 * Só roda com SEED_ENABLED=true e SEED_AGENT_PASSWORD definida; a senha nunca fica no código.
 */
@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UsuarioRepository usuarios;
    private final AutomovelRepository automoveis;
    private final PasswordEncoder encoder;
    private final boolean habilitado;
    private final String senhaAgentes;

    public DataSeeder(UsuarioRepository usuarios, AutomovelRepository automoveis, PasswordEncoder encoder,
                      @Value("${app.seed.enabled:false}") boolean habilitado,
                      @Value("${app.seed.agent-password:}") String senhaAgentes) {
        this.usuarios = usuarios;
        this.automoveis = automoveis;
        this.encoder = encoder;
        this.habilitado = habilitado;
        this.senhaAgentes = senhaAgentes;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!habilitado) {
            return;
        }
        if (senhaAgentes.isBlank()) {
            log.warn("SEED_ENABLED=true, mas SEED_AGENT_PASSWORD está vazia: agentes não foram criados");
            return;
        }
        criarAgente("agente.empresa", Perfil.AGENTE_EMPRESA);
        criarAgente("agente.banco", Perfil.AGENTE_BANCO);

        if (automoveis.count() == 0) {
            criarAutomovel("MAT-0001", 2024, "Fiat", "Argo", "ABC1D23", "180.00", TipoProprietario.EMPRESA);
            criarAutomovel("MAT-0002", 2023, "Chevrolet", "Onix", "DEF4G56", "170.00", TipoProprietario.EMPRESA);
            criarAutomovel("MAT-0003", 2025, "Toyota", "Corolla", "GHI7J89", "320.00", TipoProprietario.BANCO);
            criarAutomovel("MAT-0004", 2022, "Volkswagen", "T-Cross", "JKL0M12", "260.00", TipoProprietario.BANCO);
            log.info("Automóveis de exemplo criados");
        }
    }

    private void criarAgente(String username, Perfil perfil) {
        if (!usuarios.existsByUsername(username)) {
            usuarios.save(new Usuario(username, encoder.encode(senhaAgentes), perfil));
            log.info("Agente criado: {}", username);
        }
    }

    private void criarAutomovel(String matricula, int ano, String marca, String modelo,
                                String placa, String diaria, TipoProprietario proprietario) {
        Automovel a = new Automovel();
        a.setMatricula(matricula);
        a.setAno(ano);
        a.setMarca(marca);
        a.setModelo(modelo);
        a.setPlaca(placa);
        a.setValorDiaria(new BigDecimal(diaria));
        a.setTipoProprietario(proprietario);
        automoveis.save(a);
    }
}
