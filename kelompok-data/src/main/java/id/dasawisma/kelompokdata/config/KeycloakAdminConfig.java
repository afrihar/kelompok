package id.dasawisma.kelompokdata.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakAdminConfig {
  @Value("${keycloak.auth-server-url}")
  private String SSO_SERVER_URL;
  @Bean
  Keycloak keycloakAdmin() {
    return KeycloakBuilder.builder()
        .serverUrl(SSO_SERVER_URL)
        .realm("master")
        .username("admin")
        .password("P@ssw0rd")
        .clientId("admin-cli")
        .build();
  }
}