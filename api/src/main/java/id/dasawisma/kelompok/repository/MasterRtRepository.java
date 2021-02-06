package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterRt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterRtRepository extends JpaRepository<MasterRt, Long>, JpaSpecificationExecutor<MasterRt> {

  Iterable<MasterRt> findAllByKodeRtStartingWithOrderByRw_KodeRwAscKodeRtAsc(String kodeRt);

  Iterable<MasterRt> findAllByOrderByRw_KodeRwAscLabelRtAsc();

  MasterRt findByKodeRt(String kodeRt);
}