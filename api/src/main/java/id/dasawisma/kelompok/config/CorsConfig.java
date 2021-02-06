package id.dasawisma.kelompok.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Collections;
import java.util.List;

@Configuration
public class CorsConfig {
  @Value("${kelompok.allowed-origins}")
  private List<String> ALLOWED_ORIGINS;

  @Bean
  CorsFilter corsFilter() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    //TODO Config Origins
    config.setAllowedOrigins(ALLOWED_ORIGINS);
    config.setAllowedHeaders(Collections.singletonList("*"));
    config.setAllowedMethods(Collections.singletonList("*"));
    source.registerCorsConfiguration("/**", config);
    return new CorsFilter(source);
  }
}