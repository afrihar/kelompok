package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.Petugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface PetugasRepository extends JpaRepository<Petugas, Long>, JpaSpecificationExecutor<Petugas> {
  Iterable<Petugas> findAllByRtTugas_KodeRtStartingWithOrderByNamaAsc(@NotBlank(message = "Kode RT harus diisi.") String kodeRt);

  Petugas findByNik(String nik);

  Petugas findByEmail(String email);

  Petugas findByNoRekening(String noRekening);
}