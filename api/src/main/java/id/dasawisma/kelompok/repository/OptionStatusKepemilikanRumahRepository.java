package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionStatusKepemilikanRumah;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionStatusKepemilikanRumahRepository extends JpaRepository<OptionStatusKepemilikanRumah, Long>, JpaSpecificationExecutor<OptionStatusKepemilikanRumah> {
  Iterable<OptionStatusKepemilikanRumah> findAllByOrderById();

  OptionStatusKepemilikanRumah findOptionStatusKepemilikanRumahById(Long idStatusKepemilikanRumah);
}
