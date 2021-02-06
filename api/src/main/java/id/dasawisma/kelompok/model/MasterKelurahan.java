package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "master_kelurahan", indexes = {
    @Index(name = "idx_nama_kelurahan", columnList = "nama_kelurahan"),
    @Index(name = "idx_kode_kelurahan", columnList = "kode_kelurahan", unique = true),
    @Index(name = "idx_nama_kelompok_kelurahan", columnList = "nama_kelompok_kelurahan", unique = true),
    @Index(name = "idx_kode_kelurahan_capil", columnList = "kode_kelurahan_capil", unique = true),
    @Index(name = "idx_kode_pos", columnList = "kode_pos"),
    @Index(name = "idx_kode_kecamatan_kelurahan", columnList = "kode_kecamatan")
})
public class MasterKelurahan {
  @Id
  @Column(name = "kode_kelurahan", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode Kelurahan harus diisi.")
  private String kodeKelurahan;
  @Column(name = "nama_kelurahan")
  @NotBlank(message = "Nama Kelurahan harus diisi.")
  private String namaKelurahan;
  @Column(name = "nama_kelompok_kelurahan")
  private String namaKelompokKelurahan;
  @Column(name = "kode_kelurahan_capil")
  private String kodeKelurahanCapil;
  @Column(name = "kode_pos")
  private String kodePos;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_kecamatan", referencedColumnName = "kode_kecamatan")
  private MasterKecamatan kecamatan;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
