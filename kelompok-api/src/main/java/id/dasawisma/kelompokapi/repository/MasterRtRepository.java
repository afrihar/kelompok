package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.MasterRt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterRtRepository extends JpaRepository<MasterRt, Long>, JpaSpecificationExecutor<MasterRt> {

  Iterable<MasterRt> findAllByKodeRtStartingWithOrderByRw_KodeRwAsc(String kodeRt);

  Iterable<MasterRt> findAllByOrderByRw_KodeRwAscLabelRtAsc();

  Iterable<MasterRt> findAllByKodeRtStartingWith(@NotBlank(message = "Kode Rt harus diisi.") String kodeRt);

  MasterRt findByKodeRt(String kodeRt);
}