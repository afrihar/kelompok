package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "nik",
    "rtKelompok",
    "idKelompok"
})
@Data
public class PetugasKelompok {
  @JsonProperty("nik")
  public String nik;
  @JsonProperty("rtKelompok")
  public String rtKelompok;
  @JsonProperty("idKelompok")
  public List<Long> idKelompok;
}