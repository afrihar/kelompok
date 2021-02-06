package id.dasawisma.kelompok.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "app",
    "pget",
    "pusr",
    "status",
    "DATA"
})
public class SoaNik {
  @JsonProperty("app")
  public String app;
  @JsonProperty("pget")
  public String pget;
  @JsonProperty("pusr")
  public String pusr;
  @JsonProperty("status")
  public String status;
  @JsonProperty("DATA")
  public SoaDataNik soaDataNik;
}
