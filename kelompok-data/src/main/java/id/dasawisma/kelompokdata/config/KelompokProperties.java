package id.dasawisma.kelompokdata.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Data
@Configuration
@ConfigurationProperties(
    prefix = "kelompok.data",
    ignoreUnknownFields = false
)
public class KelompokProperties {
  private String accountClientId = "account";
  private List<String> accountRoles = Arrays.asList("manage-account", "manage-account-links", "view-profile");
  private String mapperProtocol = "openid-connect";
  private String clientRedirectUrl = "http://ui.kelompok.vm/*";
  private List<String> clientRoles = Arrays.asList("KADER", "PUSDATIN", "PROVINSI", "KOTA", "KECAMATAN", "KELURAHAN", "RW", "RT");
  private String kodeWilayah = "kode_wilayah";
}