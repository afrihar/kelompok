package id.dasawisma.kelompokdata.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "master_rw", indexes = {
    @Index(name = "idx_kode_rw", columnList = "kode_rw", unique = true),
    @Index(name = "idx_nama_ketua_rw", columnList = "nama_ketua_rw"),
    @Index(name = "idx_kode_kelurahan_rw", columnList = "kode_kelurahan")
})
public class MasterRw  {
  @Id
  @Column(name = "kode_rw", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode RW harus diisi.")
  private String kodeRw;
  @Column(name = "label_rw")
  @NotBlank(message = "Label RW harus diisi.")
  private String labelRw;
  @Column(name = "nama_ketua_rw")
  private String namaKetuaRw;
  @Column(name = "no_hp_rw")
  private String noHpRw;
  @Column(name = "no_telp_rw")
  private String noTelpRw;
  @Column(name = "no_telp_rw_alternatif")
  private String noTelpRwAlt;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_kelurahan", referencedColumnName = "kode_kelurahan")
  private MasterKelurahan kelurahan;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
