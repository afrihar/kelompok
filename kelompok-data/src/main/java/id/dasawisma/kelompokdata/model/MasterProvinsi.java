package id.dasawisma.kelompokdata.model;

import lombok.Data;
import lombok.Getter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Data
@Entity
@Table(name = "master_provinsi", indexes = {
    @Index(name = "idx_nama_provinsi", columnList = "nama_provinsi"),
    @Index(name = "idx_kode_provinsi", columnList = "kode_provinsi", unique = true),
    @Index(name = "idx_kode_provinsi_capil", columnList = "kode_provinsi_capil", unique = true)
})
public class MasterProvinsi implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Getter
  private Long id;
  @Column(name = "kode_provinsi", nullable = false, updatable = false, unique = true)
  @NotBlank(message = "Kode Provinsi harus diisi.")
  private String kodeProvinsi;
  @Column(name = "nama_provinsi")
  @NotBlank(message = "Nama Provinsi harus diisi.")
  private String namaProvinsi;
  @Column(name = "kode_provinsi_capil")
  private String kodeProvinsiCapil;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}
