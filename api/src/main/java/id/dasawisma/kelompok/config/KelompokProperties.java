package id.dasawisma.kelompok.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Data
@Configuration
@ConfigurationProperties(
    prefix = "kelompok",
    ignoreUnknownFields = false
)
public class KelompokProperties {
  private List<String> allowedOrigins;
  private String usernameTest;
  private String passwordTest;
  private String soaApp;
  private String soaPget;
  private String soaPusr;
  private String soaAuthUser;
  private String soaAuthPass;
}