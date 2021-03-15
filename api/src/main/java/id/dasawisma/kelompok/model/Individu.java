package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "individu", indexes = {
    @Index(name = "idx_nik_individu", columnList = "nik", unique = true),
    @Index(name = "idx_keluarga_individu", columnList = "id_keluarga")
})
public class Individu {
  @Id
  @Column(name = "nik", length = 16, nullable = false, unique = true)
  @NotBlank(message = "NIK harus diisi.")
  @Size(min = 16, max = 16, message = "NIK Harus 16 Karakter")
  private String nik;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "id_keluarga", referencedColumnName = "id", nullable = false)
  private Keluarga keluargaIndividu;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}