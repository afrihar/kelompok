package id.dasawisma.kelompokapi.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_pekerjaan")
public class OptionPekerjaan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_pekerjaan")
  @NotBlank(message = "Label Pekerjaan harus diisi.")
  private String labelPekerjaan;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
