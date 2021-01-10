package id.dasawisma.kelompokdata.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Data
@Entity
@Table(name = "kelompok_dasawisma", indexes = {
    @Index(name = "idx_no_urut_kelompok", columnList = "no_urut"),
    @Index(name = "idx_kode_rt_kelompok", columnList = "kode_rt_kelompok"),
    @Index(name = "idx_no_kader_kelompok", columnList = "no_kader")
})
public class KelompokDasawisma {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Size(min = 3, max = 3, message = "Harus diisi 3 angka Karakter (Char / String) bukan numerik")
  @Column(name = "no_urut", updatable = false)
  private String noUrut;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_rt_kelompok", referencedColumnName = "kode_rt", nullable = false)
  private MasterRt rt;
  @Column(name = "kuota_bangunan_per_kelompok")
  private Integer kuotaBangunanPerKelompok;
  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "no_kader", referencedColumnName = "no_kader")
  private KetuaDasawisma ketuaDasawisma;
}
