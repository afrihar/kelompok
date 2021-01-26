package id.dasawisma.kelompokapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Data
@Entity
@Table(name = "master_provinsi", indexes = {
    @Index(name = "idx_nama_provinsi", columnList = "nama_provinsi"),
    @Index(name = "idx_kode_provinsi", columnList = "kode_provinsi", unique = true),
    @Index(name = "idx_kode_provinsi_capil", columnList = "kode_provinsi_capil", unique = true)
})
public class MasterProvinsi {
  @Id
  @Column(name = "kode_provinsi", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode Provinsi harus diisi.")
  private String kodeProvinsi;
  @Column(name = "nama_provinsi")
  @NotBlank(message = "Nama Provinsi harus diisi.")
  private String namaProvinsi;
  @Column(name = "kode_provinsi_capil")
  private String kodeProvinsiCapil;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}
