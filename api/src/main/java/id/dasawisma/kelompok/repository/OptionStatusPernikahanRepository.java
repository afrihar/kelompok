package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionStatusPernikahan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionStatusPernikahanRepository extends JpaRepository<OptionStatusPernikahan, Long>, JpaSpecificationExecutor<OptionStatusPernikahan> {
  Iterable<OptionStatusPernikahan> findAllByOrderById();

  OptionStatusPernikahan findOptionStatusPernikahanById(Long idStatusPernikahan);
}