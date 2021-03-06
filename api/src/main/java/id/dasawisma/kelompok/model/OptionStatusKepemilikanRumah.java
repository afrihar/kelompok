package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_status_kepemilikan_rumah")
public class OptionStatusKepemilikanRumah {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_status_kepemilikan_rumah")
  @NotBlank(message = "Label Status Kepemilikan Rumah harus diisi.")
  private String labelStatusKepemilikanRumah;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
