package id.dasawisma.kelompokdata.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "master_kota", indexes = {
    @Index(name = "idx_nama_kota", columnList = "nama_kota"),
    @Index(name = "idx_kode_kota", columnList = "kode_kota", unique = true),
    @Index(name = "idx_kode_kota_capil", columnList = "kode_kota_capil", unique = true),
    @Index(name = "idx_kode_provinsi_kota", columnList = "kode_provinsi")
})
public class MasterKota {
  @Id
  @Column(name = "kode_kota", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode Kota harus diisi.")
  private String kodeKota;
  @Column(name = "nama_kota")
  @NotBlank(message = "Nama Kota harus diisi.")
  private String namaKota;
  @Column(name = "kode_kota_capil")
  private String kodeKotaCapil;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_provinsi", referencedColumnName = "kode_provinsi")
  private MasterProvinsi provinsi;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
