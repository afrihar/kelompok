package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rumah_tangga", indexes = {
    @Index(name = "idx_bangunan_rumah_tangga", columnList = "id_bangunan"),
    @Index(name = "idx_nik_rumah_tangga", columnList = "nik_kepala_rumah_tangga", unique = true)
})
public class RumahTangga {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "nik_kepala_rumah_tangga", referencedColumnName = "nik", nullable = false)
  private Individu individuRumahTangga;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "id_bangunan", referencedColumnName = "id", nullable = false)
  private Bangunan bangunanRumahTangga;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}