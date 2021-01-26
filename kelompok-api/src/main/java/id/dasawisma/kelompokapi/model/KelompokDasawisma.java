package id.dasawisma.kelompokapi.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "kelompok_dasawisma", indexes = {
    @Index(name = "idx_nama_kelompok", columnList = "nama_kelompok"),
    @Index(name = "idx_kode_rt_kelompok", columnList = "kode_rt_kelompok"),
    @Index(name = "idx_no_kader_kelompok", columnList = "no_kader_kelompok", unique = true)
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
  @JoinColumn(name = "no_kader_kelompok", referencedColumnName = "no_kader")
  private KetuaDasawisma ketuaDasawisma;
}