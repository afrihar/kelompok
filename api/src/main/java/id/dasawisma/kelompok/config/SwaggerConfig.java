package id.dasawisma.kelompok.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
  public static final String BEARER_KEY_SECURITY_SCHEME = "bearer-key";
  @Value("${spring.application.name}")
  private String applicationName;

  @Bean
  public OpenAPI kelompokOpenAPI() {
    return new OpenAPI()
        .components(new Components().addSecuritySchemes(BEARER_KEY_SECURITY_SCHEME,
            new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
        .info(new Info().title(applicationName));
  }

  @Bean
  public GroupedOpenApi actuatorApi() {
    return GroupedOpenApi.builder().group("00. Actuator").pathsToMatch("/actuator/**").build();
  }

  @Bean
  public GroupedOpenApi provinsiApi() {
    return GroupedOpenApi.builder().group("01. Master Provinsi").pathsToMatch("/api/provinsi/**").build();
  }

  @Bean
  public GroupedOpenApi kotaApi() {
    return GroupedOpenApi.builder().group("02. Master Kota").pathsToMatch("/api/kota/**").build();
  }

  @Bean
  public GroupedOpenApi kecamatanApi() {
    return GroupedOpenApi.builder().group("03. Master Kecamatan").pathsToMatch("/api/kecamatan/**").build();
  }

  @Bean
  public GroupedOpenApi kelurahanApi() {
    return GroupedOpenApi.builder().group("04. Master Kelurahan").pathsToMatch("/api/kelurahan/**").build();
  }

  @Bean
  public GroupedOpenApi rwApi() {
    return GroupedOpenApi.builder().group("05. Master Rw").pathsToMatch("/api/rw/**").build();
  }

  @Bean
  public GroupedOpenApi rtApi() {
    return GroupedOpenApi.builder().group("06. Master Rt").pathsToMatch("/api/rt/**").build();
  }

  @Bean
  public GroupedOpenApi optionsApi() {
    return GroupedOpenApi.builder().group("07. Options").pathsToMatch("/api/options/**").build();
  }

  @Bean
  public GroupedOpenApi petugasApi() {
    return GroupedOpenApi.builder().group("08. Petugas").pathsToMatch("/api/petugas/**").build();
  }

  @Bean
  public GroupedOpenApi kelompokApi() {
    return GroupedOpenApi.builder().group("09. Kelompok").pathsToMatch("/api/kelompok/**").build();
  }

  @Bean
  public GroupedOpenApi bangunanApi() {
    return GroupedOpenApi.builder().group("10. Bangunan").pathsToMatch("/api/bangunan/**").build();
  }

  @Bean
  public GroupedOpenApi rumahTanggaApi() {
    return GroupedOpenApi.builder().group("11. Rumah Tangga").pathsToMatch("/api/rumahtangga/**").build();
  }

  @Bean
  public GroupedOpenApi keluargaApi() {
    return GroupedOpenApi.builder().group("12. Keluarga").pathsToMatch("/api/keluarga/**").build();
  }

  @Bean
  public GroupedOpenApi individuApi() {
    return GroupedOpenApi.builder().group("13. Individu").pathsToMatch("/api/individu/**").build();
  }
}