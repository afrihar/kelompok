package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_hubungan_emergency")
public class OptionHubunganEmergency {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_hubungan_emergency")
  @NotBlank(message = "Label Hubungan Emergency harus diisi.")
  private String labelHubunganEmergency;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
