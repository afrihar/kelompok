package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.MasterRw;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterRwRepository extends JpaRepository<MasterRw, Long>, JpaSpecificationExecutor<MasterRw> {
  Iterable<MasterRw> findAllByOrderByKodeRwAsc();

  Iterable<MasterRw> findAllByKodeRwStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(String kodeRw);

  Iterable<MasterRw> findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc();

  Iterable<MasterRw> findAllByKodeRwStartingWith(@NotBlank(message = "Kode Rw harus diisi.") String kodeRw);

  MasterRw findByKodeRw(String kodeRw);
}