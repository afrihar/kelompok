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
  public GroupedOpenApi provinsiApi() {
    return GroupedOpenApi.builder().group("provinsi").pathsToMatch("/api/provinsi/**").build();
  }

  @Bean
  public GroupedOpenApi kotaApi() {
    return GroupedOpenApi.builder().group("kota").pathsToMatch("/api/kota/**").build();
  }

  @Bean
  public GroupedOpenApi kecamatanApi() {
    return GroupedOpenApi.builder().group("kecamatan").pathsToMatch("/api/kecamatan/**").build();
  }

  @Bean
  public GroupedOpenApi kelurahanApi() {
    return GroupedOpenApi.builder().group("kelurahan").pathsToMatch("/api/kelurahan/**").build();
  }

  @Bean
  public GroupedOpenApi rwApi() {
    return GroupedOpenApi.builder().group("rw").pathsToMatch("/api/rw/**").build();
  }

  @Bean
  public GroupedOpenApi rtApi() {
    return GroupedOpenApi.builder().group("rt").pathsToMatch("/api/rt/**").build();
  }

  @Bean
  public GroupedOpenApi petugasApi() {
    return GroupedOpenApi.builder().group("petugas").pathsToMatch("/api/petugas/**").build();
  }

  @Bean
  public GroupedOpenApi kelompokApi() {
    return GroupedOpenApi.builder().group("kelompok").pathsToMatch("/api/kelompok/**").build();
  }

  @Bean
  public GroupedOpenApi optionsApi() {
    return GroupedOpenApi.builder().group("options").pathsToMatch("/api/options/**").build();
  }

  @Bean
  public GroupedOpenApi actuatorApi() {
    return GroupedOpenApi.builder().group("actuator").pathsToMatch("/actuator/**").build();
  }
}