package id.dasawisma.kelompokapi.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_agama")
public class OptionAgama {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_agama")
  @NotBlank(message = "Label Agama harus diisi.")
  private String labelAgama;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
