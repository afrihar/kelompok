package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterRt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterRtRepository extends JpaRepository<MasterRt, Long>, JpaSpecificationExecutor<MasterRt> {
  Iterable<MasterRt> findAllByOrderByRw_KodeRwAscLabelRtAsc();

  Iterable<MasterRt> findAllByRw_KodeRwStartingWithOrderByRw_KodeRwAscKodeRtAsc(String kodeRw);

  Iterable<MasterRt> findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(String kodeRw);

  Iterable<MasterRt> findAllByKodeRt(String kodeRt);

  MasterRt findByKodeRt(String kodeRt);
}