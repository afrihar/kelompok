package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionAgama;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionAgamaRepository extends JpaRepository<OptionAgama, Long>, JpaSpecificationExecutor<OptionAgama> {
  Iterable<OptionAgama> findAllByOrderById();

  OptionAgama findOptionAgamaById(Long idAgama);
}
