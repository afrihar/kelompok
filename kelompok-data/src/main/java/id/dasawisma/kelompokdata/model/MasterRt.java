package id.dasawisma.kelompokdata.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
@Entity
@Table(name = "master_rt", indexes = {
    @Index(name = "idx_kode_rt", columnList = "kode_rt", unique = true),
    @Index(name = "idx_nama_ketua_rt", columnList = "nama_ketua_rt"),
    @Index(name = "idx_kode_rw_rt", columnList = "kode_rw")
})
public class MasterRt implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "kode_rt", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode RT harus diisi.")
  private String kodeRt;
  @Column(name = "label_rt")
  private String labelRt;
  @Column(name = "nama_ketua_rt")
  private String namaKetuaRt;
  @Column(name = "no_hp_rt")
  private String noHpRt;
  @Column(name = "no_telp_rt")
  private String noTelpRt;
  @Column(name = "no_telp_rt_alternatif")
  private String noTelpRtAlt;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_rw", referencedColumnName = "kode_rw")
  private MasterRw rw;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
