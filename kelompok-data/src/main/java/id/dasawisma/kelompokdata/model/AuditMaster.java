package id.dasawisma.kelompokdata.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.time.LocalDateTime;

@SuppressWarnings("JpaDataSourceORMInspection")
@Data
@Embeddable
public class AuditMaster {
  @Column(name = "created_at", nullable = false, updatable = false)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "Asia/Jakarta", locale = "id_ID")
  private LocalDateTime createdAt;
  @Column(name = "created_by")
  private String createdBy;
  @Column(name = "updated_at")
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "Asia/Jakarta", locale = "id_ID")
  private LocalDateTime updatedAt;
  @Column(name = "updated_by")
  private String updatedBy;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    createdBy = "Rangga";
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = LocalDateTime.now();
    createdBy = "Rangga";
  }
}