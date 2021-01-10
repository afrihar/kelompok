package id.dasawisma.kelompokdata.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
@Entity
@Table(name = "petugas", indexes = {
    @Index(name = "idx_domisili_rt_petugas", columnList = "domisili_rt"),
    @Index(name = "idx_email_petugas", columnList = "email", unique = true),
    @Index(name = "idx_nama_petugas", columnList = "nama"),
    @Index(name = "idx_nik_petugas", columnList = "nik", unique = true),
    @Index(name = "idx_no_hp_petugas", columnList = "no_hp_petugas"),
    @Index(name = "idx_no_rekening_petugas", columnList = "no_rekening", unique = true)
})
public class Petugas {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(name = "nik", length = 16, nullable = false, unique = true)
  @NotBlank(message = "NIK harus diisi.")
  @Size(min = 16, max = 16, message = "NIK Harus 16 Karakter")
  private String nik;
  @Column(name = "nama")
  @NotBlank(message = "Nama Petugas harus diisi.")
  private String nama;
  @Column(name = "domisili_alamat")
  private String alamatDomisili;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "domisili_rt", referencedColumnName = "kode_rt")
  private MasterRt rt;
  @Column(name = "no_hp_petugas")
  private String noHpPetugas;
  @Column(name = "no_telp_petugas")
  private String noTelpPetugas;
  @Column(name = "email", unique = true)
  private String email;
  @Column(name = "no_rekening", unique = true)
  private String noRekening;
  @Column(name = "no_npwp")
  private String noNpwp;
  @Column(name = "no_sk_lurah")
  private String noSkLurah;
  @Column(name = "gender")
  private String gender;
  @Column(name = "tempat_lahir")
  private String tempatLahir;
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  private Date tanggalLahir;
  @Column(name = "nama_ibu_kandung")
  private String namaIbuKandung;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "status_pernikahan", referencedColumnName = "id")
  private OptionStatusPernikahan statusPernikahan;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "agama", referencedColumnName = "id")
  private OptionAgama agama;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "pendidikan", referencedColumnName = "id")
  private OptionPendidikan pendidikan;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "status_kepemilikan_rumah", referencedColumnName = "id")
  private OptionStatusKepemilikanRumah statusKepemilikanRumah;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "pekerjaan", referencedColumnName = "id")
  private OptionPekerjaan pekerjaan;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "status_pekerjaan", referencedColumnName = "id")
  private OptionStatusPekerjaan statusPekerjaan;
  @Column(name = "nama_pasangan")
  private String namaPasangan;
  @Column(name = "nama_emergency_call")
  private String namaEmergencyCall;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "hubungan_emergency_call", referencedColumnName = "id")
  private OptionHubunganEmergency hubunganEmergency;
  @Column(name = "alamat_emergency_call")
  private String alamatEmergencyCall;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_kota_emergency_call", referencedColumnName = "kode_kota")
  private MasterKota kota;
  @ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
  @JoinColumn(name = "kode_provinsi_emergency_call", referencedColumnName = "kode_provinsi")
  private MasterProvinsi provinsi;
  @Column(name = "no_hp_emergency_call")
  private String noHpEmergencyCall;
  @Embedded
  private AuditMaster auditMaster = new AuditMaster();
}