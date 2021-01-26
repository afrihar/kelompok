package id.dasawisma.kelompokapi.config;

import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.management.HttpSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@KeycloakConfiguration
public class WebSecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
  public static final String PUSDATIN = "PUSDATIN";
  public static final String PROVINSI = "PROVINSI";
  public static final String KOTA = "KOTA";
  public static final String KECAMATAN = "KECAMATAN";
  public static final String KELURAHAN = "KELURAHAN";
  public static final String RW = "RW";
  public static final String RT = "RT";
  public static final String KADER = "KADER";

  @Autowired
  public void configureGlobal(AuthenticationManagerBuilder auth) {
    KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
    keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
    auth.authenticationProvider(keycloakAuthenticationProvider);
  }

  @Bean
  public KeycloakSpringBootConfigResolver keycloakConfigResolver() {
    return new KeycloakSpringBootConfigResolver();
  }

  @Bean
  @Override
  protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
    return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
  }

  //TODO Config authorization
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    super.configure(http);
    http.authorizeRequests()
        .antMatchers(HttpMethod.GET, "/actuator/**").permitAll()
        .antMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs", "/v3/api-docs/**").permitAll()
        .antMatchers("/api/userextras/me").authenticated()
        .antMatchers("/api/provinsi", "/api/provinsi/**").hasRole(PUSDATIN)
        .antMatchers("/api/kota", "/api/kota/**").hasAnyRole(PUSDATIN, PROVINSI)
        .antMatchers("/api/kecamatan", "/api/kecamatan/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA)
        .antMatchers("/api/kelurahan", "/api/kelurahan/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA, KECAMATAN)
        .antMatchers("/api/rw", "/api/rw/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA, KECAMATAN, KELURAHAN)
        .antMatchers("/api/rt", "/api/rt/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA, KECAMATAN, KELURAHAN, RW)
        .antMatchers("/api/kader", "/api/kader/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA, KECAMATAN, KELURAHAN, RW, RT)
        .antMatchers("/api/petugas", "/api/petugas/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA, KECAMATAN, KELURAHAN, RW, RT)
        .antMatchers("/api/kelompok", "/api/kelompok/**").hasAnyRole(PUSDATIN, PROVINSI, KOTA, KECAMATAN, KELURAHAN, RW, RT)
        .anyRequest().authenticated();
    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    http.cors().and().csrf().disable();
  }

  @Bean
  @Override
  @ConditionalOnMissingBean(HttpSessionManager.class)
  protected HttpSessionManager httpSessionManager() {
    return new HttpSessionManager();
  }
}