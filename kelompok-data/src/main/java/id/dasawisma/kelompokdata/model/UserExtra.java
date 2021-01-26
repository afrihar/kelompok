package id.dasawisma.kelompokdata.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "userextras")
public class UserExtra {
  @Id
  private String username;
  private String avatar;
  private String kodeWilayah;

  public UserExtra() {
  }

  public UserExtra(String username) {
    this.username = username;
  }
}