package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionPekerjaan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionPekerjaanRepository extends JpaRepository<OptionPekerjaan, Long>, JpaSpecificationExecutor<OptionPekerjaan> {
  Iterable<OptionPekerjaan> findAllByOrderById();

  OptionPekerjaan findOptionPekerjaanById(Long idPekerjaan);
}
