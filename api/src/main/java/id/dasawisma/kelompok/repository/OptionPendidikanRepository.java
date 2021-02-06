package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionPendidikan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionPendidikanRepository extends JpaRepository<OptionPendidikan, Long>, JpaSpecificationExecutor<OptionPendidikan> {
  Iterable<OptionPendidikan> findAllByOrderById();

  OptionPendidikan findOptionPendidikanById(Long idPendidikan);
}
