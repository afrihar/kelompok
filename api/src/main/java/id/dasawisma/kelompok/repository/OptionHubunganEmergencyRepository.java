package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.OptionHubunganEmergency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionHubunganEmergencyRepository extends JpaRepository<OptionHubunganEmergency, Long>, JpaSpecificationExecutor<OptionHubunganEmergency> {
  Iterable<OptionHubunganEmergency> findAllByOrderById();

  OptionHubunganEmergency findOptionHubunganEmergencyById(Long idHubunganEmergency);
}
