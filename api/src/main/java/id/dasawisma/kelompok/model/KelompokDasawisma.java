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
  private MasterRt rt;
  @OneToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "nik_petugas", referencedColumnName = "nik")
  private Petugas petugas;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}