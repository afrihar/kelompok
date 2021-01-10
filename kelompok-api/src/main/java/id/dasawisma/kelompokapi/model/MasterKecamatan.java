package id.dasawisma.kelompokapi.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
@Entity
@Table(name = "master_kecamatan", indexes = {
    @Index(name = "idx_nama_kecamatan", columnList = "nama_kecamatan"),
    @Index(name = "idx_kode_kecamatan", columnList = "kode_kecamatan", unique = true),
    @Index(name = "idx_kode_kecamatan_capil", columnList = "kode_kecamatan_capil", unique = true),
    @Index(name = "idx_kode_kota_kecamatan", columnList = "kode_kota")
})
public class MasterKecamatan implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "kode_kecamatan", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode Kecamatan harus diisi.")
  private String kodeKecamatan;
  @Column(name = "nama_kecamatan")
  @NotBlank(message = "Nama Kecamatan harus diisi.")
  private String namaKecamatan;
  @Column(name = "kode_kecamatan_capil")
  private String kodeKecamatanCapil;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_kota", referencedColumnName = "kode_kota")
  private MasterKota kota;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
