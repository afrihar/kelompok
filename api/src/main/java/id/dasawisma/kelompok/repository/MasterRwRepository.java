package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterRw;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterRwRepository extends JpaRepository<MasterRw, Long>, JpaSpecificationExecutor<MasterRw> {
  Iterable<MasterRw> findAllByKodeRwStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(@NotBlank(message = "Kode Rw harus diisi.") String kodeRw);

  Iterable<MasterRw> findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc();

  MasterRw findByKodeRw(String kodeRw);
}