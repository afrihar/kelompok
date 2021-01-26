package id.dasawisma.kelompokapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "ketua_dasawisma", indexes = {
    @Index(name = "idx_no_kader_ketua_dasawisma", columnList = "no_kader", unique = true),
    @Index(name = "idx_rt_tugas_ketua_dasawisma", columnList = "rt_tugas"),
    @Index(name = "idx_nik_petugas_ketua_dasawisma", columnList = "nik_petugas")
})
public class KetuaDasawisma {
  @Id
  @Column(name = "no_kader", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "ID Kader harus diisi.")
  private String noKader;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "rt_tugas", referencedColumnName = "kode_rt")
  private MasterRt rt;
  @JsonIgnore
  @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "ketuaDasawisma")
  private KelompokDasawisma kelompokDasawisma;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "nik_petugas", referencedColumnName = "nik")
  private Petugas petugas;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}