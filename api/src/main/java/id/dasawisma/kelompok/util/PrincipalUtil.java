package id.dasawisma.kelompok.util;

import id.dasawisma.kelompok.config.WebSecurityConfig;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.keycloak.adapters.springsecurity.account.SimpleKeycloakAccount;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.security.Principal;
import java.util.Map;
import java.util.Set;

public final class PrincipalUtil {
  public static String getKodeWilayah() {
    Principal principal = SecurityContextHolder.getContext().getAuthentication();
    String kodeWilayah = "";
    if (principal instanceof KeycloakAuthenticationToken) {
      SimpleKeycloakAccount simpleKeycloakAccount = (SimpleKeycloakAccount) ((KeycloakAuthenticationToken) principal).getDetails();
      RefreshableKeycloakSecurityContext refreshableKeycloakSecurityContext = simpleKeycloakAccount.getKeycloakSecurityContext();
      AccessToken accessToken = refreshableKeycloakSecurityContext.getToken();
      Map<String, Object> customClaims = accessToken.getOtherClaims();
      if (customClaims.containsKey("kode_wilayah")) {
        kodeWilayah = String.valueOf(customClaims.get("kode_wilayah"));
      }
    }
    return kodeWilayah;
  }

  public static String getPreferredUsername() {
    Principal principal = SecurityContextHolder.getContext().getAuthentication();
    if (principal instanceof KeycloakAuthenticationToken) {
      SimpleKeycloakAccount simpleKeycloakAccount = (SimpleKeycloakAccount) ((KeycloakAuthenticationToken) principal).getDetails();
      RefreshableKeycloakSecurityContext refreshableKeycloakSecurityContext = simpleKeycloakAccount.getKeycloakSecurityContext();
      AccessToken accessToken = refreshableKeycloakSecurityContext.getToken();
      return accessToken.getPreferredUsername();
    } else {
      return null;
    }
  }

  public static Set<String> getRoles() {
    Principal principal = SecurityContextHolder.getContext().getAuthentication();
    Set<String> roles = null;
    if (principal instanceof KeycloakAuthenticationToken) {
      SimpleKeycloakAccount simpleKeycloakAccount = (SimpleKeycloakAccount) ((KeycloakAuthenticationToken) principal).getDetails();
      roles = simpleKeycloakAccount.getRoles();
    }
    return roles;
  }

  public static boolean isPusdatin() {
    return getRoles().contains(WebSecurityConfig.PUSDATIN);
  }

  public static boolean isProvinsi() {
    return getRoles().contains(WebSecurityConfig.PROVINSI);
  }

  public static boolean isKota() {
    return getRoles().contains(WebSecurityConfig.KOTA);
  }

  public static boolean isKecamatan() {
    return getRoles().contains(WebSecurityConfig.KECAMATAN);
  }

  public static boolean isKelurahan() {
    return getRoles().contains(WebSecurityConfig.KELURAHAN);
  }

  public static boolean isRw() {
    return getRoles().contains(WebSecurityConfig.RW);
  }

  public static boolean isRt() {
    return getRoles().contains(WebSecurityConfig.RT);
  }

  public static boolean isKader() {
    return getRoles().contains(WebSecurityConfig.KADER);
  }
}