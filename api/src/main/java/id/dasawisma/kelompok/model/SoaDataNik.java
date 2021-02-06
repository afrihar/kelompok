package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"ANGGOTA"})
public class SoaDataNik {
  @JsonProperty("ANGGOTA")
  public SoaAnggota anggota;
}
