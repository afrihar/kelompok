package id.dasawisma.kelompokapi.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(
    prefix = "kelompok.api",
    ignoreUnknownFields = false
)
public class KelompokProperties {
  private List<String> allowedOrigins;
  private String usernameTest;
  private String passwordTest;
}