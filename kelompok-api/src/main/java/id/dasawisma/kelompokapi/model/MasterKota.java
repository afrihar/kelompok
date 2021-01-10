package id.dasawisma.kelompokapi.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
@Entity
@Table(name = "master_kota", indexes = {
    @Index(name = "idx_nama_kota", columnList = "nama_kota"),
    @Index(name = "idx_kode_kota", columnList = "kode_kota", unique = true),
    @Index(name = "idx_kode_kota_capil", columnList = "kode_kota_capil", unique = true),
    @Index(name = "idx_kode_provinsi_kota", columnList = "kode_provinsi")
})
public class MasterKota implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "kode_kota", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode Kota harus diisi.")
  private String kodeKota;
  @Column(name = "nama_kota")
  @NotBlank(message = "Nama Kota harus diisi.")
  private String namaKota;
  @Column(name = "kode_kota_capil")
  private String kodeKotaCapil;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_provinsi", referencedColumnName = "kode_provinsi")
  private MasterProvinsi provinsi;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
