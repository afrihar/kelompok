package id.dasawisma.kelompokdata.component;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserKeycloak {
  private String username;
  private String password;
  private String kodeWilayah;
  private String firstname;
  private String lastname;
}