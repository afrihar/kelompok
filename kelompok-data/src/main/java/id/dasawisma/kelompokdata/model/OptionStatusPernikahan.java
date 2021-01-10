package id.dasawisma.kelompokdata.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_status_pernikahan")
public class OptionStatusPernikahan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_status_pernikahan")
  @NotBlank(message = "Label status harus diisi.")
  private String labelStatusPernikahan;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
