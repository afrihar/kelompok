package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"ANGGOTA"})
public class SoaDataNikKk {
  @JsonProperty("ANGGOTA")
  public List<SoaAnggota> soaAnggota = new ArrayList<>();
}