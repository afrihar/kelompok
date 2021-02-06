package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionStatusPekerjaan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionStatusPekerjaanRepository extends JpaRepository<OptionStatusPekerjaan, Long>, JpaSpecificationExecutor<OptionStatusPekerjaan> {
  Iterable<OptionStatusPekerjaan> findAllByOrderById();

  OptionStatusPekerjaan findOptionStatusPekerjaanById(Long idStatusPekerjaan);
}
