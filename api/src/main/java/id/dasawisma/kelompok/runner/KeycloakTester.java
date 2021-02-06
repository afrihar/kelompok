package id.dasawisma.kelompok.runner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class KeycloakTester implements CommandLineRunner {
  @Value("${keycloak.auth-server-url}")
  private String SSO_SERVER_URL;
  @Value("${keycloak.realm}")
  private String REALM_NAME;
  @Value("${keycloak.resource}")
  private String CLIENT_NAME;
  @Value("${kelompok.username-test}")
  private String USERNAME;
  @Value("${kelompok.password-test}")
  private String PASSWORD;

  @Override
  public void run(String... args) {
    Keycloak keycloakApp = KeycloakBuilder.builder().serverUrl(SSO_SERVER_URL)
        .realm(REALM_NAME).username(USERNAME).password(PASSWORD)
        .clientId(CLIENT_NAME).build();
    log.info("Token untuk user '{}' : {}", USERNAME, keycloakApp.tokenManager().grantToken().getToken());
  }
}