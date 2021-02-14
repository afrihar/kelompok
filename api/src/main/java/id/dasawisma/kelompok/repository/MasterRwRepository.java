package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterRw;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterRwRepository extends JpaRepository<MasterRw, Long>, JpaSpecificationExecutor<MasterRw> {
  Iterable<MasterRw> findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc();

  Iterable<MasterRw> findAllByKelurahan_KodeKelurahanStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(String kodeKelurahan);

  Iterable<MasterRw> findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(String kodeKelurahan);

  Iterable<MasterRw> findAllByKodeRw(String kodeRw);

  MasterRw findMasterRwByKodeRw(String kodeRw);
}