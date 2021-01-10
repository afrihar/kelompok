package id.dasawisma.kelompokdata.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_status_pekerjaan")
public class OptionStatusPekerjaan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_status_pekerjaan")
  @NotBlank(message = "Label Status Pekerjaan harus diisi.")
  private String labelStatusPekerjaan;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
