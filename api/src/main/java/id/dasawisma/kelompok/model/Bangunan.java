package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "bangunan", indexes = {
    @Index(name = "idx_no_urut", columnList = "no_urut"),
    @Index(name = "idx_identifikasi", columnList = "identifikasi"),
    @Index(name = "idx_kelompok_bangunan", columnList = "id_kelompok")
})
public class Bangunan {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "no_urut")
  private Integer noUrut;
  @Column(name = "identifikasi")
  private String identifikasi;
  @ManyToOne(fetch = FetchType.EAGER, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "id_kelompok", referencedColumnName = "id", nullable = false)
  private KelompokDasawisma kelompokBangunan;
  @Embedded
  @JsonIgnore
  private AuditMaster auditMaster = new AuditMaster();
}