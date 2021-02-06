package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
