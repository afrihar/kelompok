package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "kelompok_dasawisma", indexes = {
    @Index(name = "idx_nama_kelompok", columnList = "nama_kelompok", unique = true),
    @Index(name = "idx_kode_rt_kelompok", columnList = "kode_rt_kelompok"),
    @Index(name = "idx_nik_kelompok", columnList = "nik_petugas")
})
public class KelompokDasawisma {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "nama_kelompok")
  private String namaKelompok;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_rt_kelompok", referencedColumnName = "kode_rt", nullable = false)
  private MasterRt rtKelompok;
  @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "nik_petugas", referencedColumnName = "nik")
  private Petugas petugasKelompok;
  @Column(name = "target_bangunan")
  private Integer targetBangunanKelompok;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}