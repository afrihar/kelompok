package id.dasawisma.kelompokdata.component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.protocol.oidc.mappers.OIDCAttributeMapperHelper;
import org.keycloak.protocol.oidc.mappers.UserAttributeMapper;
import org.keycloak.representations.idm.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

import static id.dasawisma.kelompokdata.data.Users.KELOMPOK_APP_USERS;

@Slf4j
@RequiredArgsConstructor
@Component
public class RealmInitializer implements CommandLineRunner {
  private final Keycloak keycloakAdmin;
  @Value("${keycloak.resource}")
  private String CLIENT_NAME;
  @Value("${keycloak.auth-server-url}")
  private String SSO_SERVER_URL;
  @Value("${keycloak.realm}")
  private String REALM_NAME;
  @Value("${kelompok.data.client-roles}")
  private List<String> CLIENT_ROLES;
  @Value("${kelompok.data.client-redirect-url}")
  private String CLIENT_REDIRECT_URL;
  @Value("${kelompok.data.mapper-protocol}")
  private String MAPPER_PROTOCOL;
  @Value("${kelompok.data.kode-wilayah}")
  private String KODE_WILAYAH;
  @Value("${kelompok.data.account-client-id}")
  private String ACCOUNT_CLIENT_ID;
  @Value("${kelompok.data.account-roles}")
  private List<String> ACCOUNT_ROLES;

  @Override
  public void run(String... args) {
    log.info("Memulai Pembentukan Realm '{}' di Keycloak", REALM_NAME);
    Optional<RealmRepresentation> representationOptional =
        keycloakAdmin.realms().findAll().stream().filter(r -> r.getRealm().equals(REALM_NAME)).findAny();
    if (representationOptional.isPresent()) {
      log.info("Menghapus Realm '{}' karna sudah ada sebelumnya", REALM_NAME);
      keycloakAdmin.realm(REALM_NAME).remove();
    }
    RealmRepresentation realmRepresentation = new RealmRepresentation();
    log.info("Membuat Realm : '{}'", REALM_NAME);
    realmRepresentation.setRealm(REALM_NAME);
    log.info("Set id Realm : '{}'", REALM_NAME);
    realmRepresentation.setId(REALM_NAME);
    log.info("Set Display Name Realm : '{}'", REALM_NAME);
    realmRepresentation.setDisplayName(REALM_NAME);
    log.info("Set Enabled Realm '{}'", REALM_NAME);
    realmRepresentation.setEnabled(true);
    log.info("Set Registration Allowed Realm '{}'", REALM_NAME);
    realmRepresentation.setRegistrationAllowed(true);
    log.info("Membuat Client ...");
    realmRepresentation.setClients(createClients());
    log.info("Membuat User ...");
    realmRepresentation.setUsers(createUsers());
    keycloakAdmin.realms().create(realmRepresentation);
    UserKeycloak admin = KELOMPOK_APP_USERS.get(0);
    log.info("Mencoba mengambil token '{}' untuk testing ...", admin.getUsername());
    Keycloak keycloakApp = KeycloakBuilder.builder().serverUrl(SSO_SERVER_URL)
        .realm(REALM_NAME).username(admin.getUsername()).password(admin.getPassword())
        .clientId(CLIENT_NAME).build();
    log.info("Token untuk user '{}' : {}", admin.getUsername(), keycloakApp.tokenManager().grantToken().getToken());
    log.info("Inisialisasi Realm '{}' Selesai dan siap digunakan!", REALM_NAME);
  }

  private List<ClientRepresentation> createClients() {
    ClientRepresentation clientRepresentation = new ClientRepresentation();
    log.info("Set ClientId : {}", CLIENT_NAME);
    clientRepresentation.setClientId(CLIENT_NAME);
    log.info("Set Client Name : {}", CLIENT_NAME);
    clientRepresentation.setName(CLIENT_NAME);
    log.info("Set Public Client");
    clientRepresentation.setPublicClient(Boolean.TRUE);
    log.info("Set Default Roles ke : {}", CLIENT_ROLES.get(0));
    clientRepresentation.setDefaultRoles(new String[]{CLIENT_ROLES.get(0)}); //KADER
    log.info("Set set Redirect Uri ke : {}", CLIENT_REDIRECT_URL);
    clientRepresentation.setRedirectUris(Collections.singletonList(CLIENT_REDIRECT_URL));
    log.info("Set Enabled");
    clientRepresentation.setEnabled(Boolean.TRUE);
    // normally you wouldn't do this, but we use the direct grant to be able
    // to fetch the token for demo purposes per curl
    log.info("Set DirectAccessGrantsEnabled");
    clientRepresentation.setDirectAccessGrantsEnabled(true);
    log.info("Membuat ProtocolMappers ...");
    clientRepresentation.setProtocolMappers(Collections.singletonList(createWilayahMapper()));
    log.info("Client berhasil dibuat");
    return Collections.singletonList(clientRepresentation);
  }

  private ProtocolMapperRepresentation createWilayahMapper() {
    ProtocolMapperRepresentation wilayahMappers = new ProtocolMapperRepresentation();
    log.info("Set Protocol : {}", MAPPER_PROTOCOL);
    wilayahMappers.setProtocol(MAPPER_PROTOCOL);
    log.info("Set Id Mappers : {}", KODE_WILAYAH);
    wilayahMappers.setId(KODE_WILAYAH);
    log.info("Set Name Mappers : {}", KODE_WILAYAH);
    wilayahMappers.setName(KODE_WILAYAH);
    log.info("Set ProtocolMapper : {}", UserAttributeMapper.PROVIDER_ID);
    wilayahMappers.setProtocolMapper(UserAttributeMapper.PROVIDER_ID);
    Map<String, String> config = new HashMap<>();
    config.put("user.attribute", KODE_WILAYAH);
    config.put(OIDCAttributeMapperHelper.TOKEN_CLAIM_NAME, KODE_WILAYAH);
    config.put(OIDCAttributeMapperHelper.JSON_TYPE, "JSON");
    config.put(OIDCAttributeMapperHelper.INCLUDE_IN_ID_TOKEN, "true");
    config.put(OIDCAttributeMapperHelper.INCLUDE_IN_ACCESS_TOKEN, "true");
    config.put(OIDCAttributeMapperHelper.INCLUDE_IN_USERINFO, "true");
    wilayahMappers.setConfig(config);
    log.info("Wilayah Mapper berhasil dibuat");
    return wilayahMappers;
  }

  private List<UserRepresentation> createUsers() {
    List<UserRepresentation> userRepresentations;
    userRepresentations = KELOMPOK_APP_USERS.stream().map(userInfo -> {
      UserRepresentation userRepresentation = new UserRepresentation();
      userRepresentation.setUsername(userInfo.getUsername());
      userRepresentation.setFirstName(userInfo.getFirstname());
      userRepresentation.setLastName(userInfo.getLastname());
      userRepresentation.setEnabled(true);
      // Client roles
      Map<String, List<String>> clientRoles = new HashMap<>();
      clientRoles.put(ACCOUNT_CLIENT_ID, ACCOUNT_ROLES);
      switch (userInfo.getUsername()) {
        case "root":
          clientRoles.put(CLIENT_NAME, CLIENT_ROLES);
          break;
        case "b00151":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(0)));
          break;
        case "rangga":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(1)));
          break;
        case "prov.jakarta":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(2)));
          break;
        case "kota.jakarta.barat":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(3)));
          break;
        case "kec.palmerah":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(4)));
          break;
        default:
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(5)));
          break;
        case "3174030001001":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(6)));
          break;
        case "3174030001001001":
          clientRoles.put(CLIENT_NAME, Collections.singletonList(CLIENT_ROLES.get(7)));
          break;
      }
      userRepresentation.setClientRoles(clientRoles);
      // User Credentials
      CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
      credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
      credentialRepresentation.setValue(userInfo.getPassword());
      userRepresentation.setCredentials(Collections.singletonList(credentialRepresentation));
      Map<String, List<String>> userAttributes = new HashMap<>();
      userAttributes.put(KODE_WILAYAH, Collections.singletonList(userInfo.getKodeWilayah()));
      userRepresentation.setAttributes(userAttributes);
      if (!userInfo.getUsername().equals(KELOMPOK_APP_USERS.get(0).getUsername())) {
//        VERIFY_EMAIL, UPDATE_PROFILE, CONFIGURE_TOTP, UPDATE_PASSWORD, TERMS_AND_CONDITIONS
//        userRepresentation.setRequiredActions(Arrays.asList("UPDATE_PASSWORD", "UPDATE_PROFILE"));
        userRepresentation.setRequiredActions(Collections.singletonList("UPDATE_PASSWORD"));
      }
      log.info("User {} berhasil dibuat", userInfo.getUsername());
      return userRepresentation;
    }).collect(Collectors.toList());
    return userRepresentations;
  }
}