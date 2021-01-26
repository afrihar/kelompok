package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.Petugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PetugasRepository extends JpaRepository<Petugas, Long>, JpaSpecificationExecutor<Petugas> {
  Iterable<Petugas> findAllByRtDomisili_KodeRtOrderByNamaAsc(String kodeRt);

  Petugas findByNik(String nik);

  Petugas findByEmail(String email);

  Petugas findByNoRekening(String noRekening);
}