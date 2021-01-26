package id.dasawisma.kelompokapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "option_pendidikan")
public class OptionPendidikan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "label_pendidikan")
  @NotBlank(message = "Label Pendidikan harus diisi.")
  private String labelPendidikan;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
