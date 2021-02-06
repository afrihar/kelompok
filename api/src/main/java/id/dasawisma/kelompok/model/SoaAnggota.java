package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "NIK",
    "NO_KK",
    "NAMA_LGKP",
    "JENIS_KLMIN",
    "TMPT_LHR",
    "TGL_LHR",
    "AKTA_LHR",
    "NO_AKTA_LHR",
    "GOL_DRH",
    "DSC_GOL_DRH",
    "AGAMA",
    "DSC_AGAMA",
    "STAT_KWN",
    "DSC_STAT_KWN",
    "STAT_HBKEL",
    "DSC_STAT_HBKEL",
    "PDDK_AKH",
    "DSC_PDDK_AKH",
    "JENIS_PKRJN",
    "DSC_JENIS_PKRJN",
    "NO_PROP",
    "NM_PROP",
    "NO_KAB",
    "NM_KAB",
    "NO_KEC",
    "NM_KEC",
    "NO_KEL",
    "NM_KEL",
    "ALAMAT",
    "NO_RT",
    "NO_RW",
    "NO_AKTA_KWN",
    "NOBPJS"
})
@Data
public class SoaAnggota {
  @JsonProperty("NIK")
  public String nik;
  @JsonProperty("NO_KK")
  public String noKk;
  @JsonProperty("NAMA_LGKP")
  public String namaLengkap;
  @JsonProperty("JENIS_KLMIN")
  public String jenisKelamin;
  @JsonProperty("TMPT_LHR")
  public String tempatLahir;
  @JsonProperty("TGL_LHR")
  public String tanggalLahir;
  @JsonProperty("AKTA_LHR")
  public String aktaLahir;
  @JsonProperty("NO_AKTA_LHR")
  public String noAktaLahir;
  @JsonProperty("GOL_DRH")
  public String golonganDarah;
  @JsonProperty("DSC_GOL_DRH")
  public String descGolonganDarah;
  @JsonProperty("AGAMA")
  public String agama;
  @JsonProperty("DSC_AGAMA")
  public String descAgama;
  @JsonProperty("STAT_KWN")
  public String statusKawin;
  @JsonProperty("DSC_STAT_KWN")
  public String descStatusKawin;
  @JsonProperty("STAT_HBKEL")
  public String statusHubKeluarga;
  @JsonProperty("DSC_STAT_HBKEL")
  public String descStatusHubKeluarga;
  @JsonProperty("PDDK_AKH")
  public String pendidikanTerakhir;
  @JsonProperty("DSC_PDDK_AKH")
  public String deskPendidikanTerakhir;
  @JsonProperty("JENIS_PKRJN")
  public String jenisPekerjaan;
  @JsonProperty("DSC_JENIS_PKRJN")
  public String descJenisPekerjaan;
  @JsonProperty("NO_PROP")
  public String kodeProvinsiCapil;
  @JsonProperty("NM_PROP")
  public String namaProvinsiCapil;
  @JsonProperty("NO_KAB")
  public String kodeKotaCapil;
  @JsonProperty("NM_KAB")
  public String namaKotaCapil;
  @JsonProperty("NO_KEC")
  public String kodeKecamatanCapil;
  @JsonProperty("NM_KEC")
  public String namaKecamatanCapil;
  @JsonProperty("NO_KEL")
  public String kodeKelurahanCapil;
  @JsonProperty("NM_KEL")
  public String namaKelurahanCapil;
  @JsonProperty("ALAMAT")
  public String alamat;
  @JsonProperty("NO_RT")
  public String rtCapil;
  @JsonProperty("NO_RW")
  public String rwCapil;
  @JsonProperty("NO_AKTA_KWN")
  public String noAktaKawin;
  @JsonProperty("NOBPJS")
  public String noBpjs;
}
