package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "keluarga", indexes = {
    @Index(name = "idx_rumah_tangga_keluarga", columnList = "id_rumah_tangga"),
    @Index(name = "idx_nik_keluarga", columnList = "nik_kepala_keluarga", unique = true)
})
public class Keluarga {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "nik_kepala_keluarga", referencedColumnName = "nik", nullable = false)
  private Individu individuKeluarga;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "id_rumah_tangga", referencedColumnName = "id", nullable = false)
  private RumahTangga rumahTanggaKeluarga;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}