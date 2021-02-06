package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.Petugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PetugasRepository extends JpaRepository<Petugas, Long>, JpaSpecificationExecutor<Petugas> {
  Petugas findByNik(String nik);

  Petugas findByEmail(String email);

  Petugas findByNoRekening(String noRekening);
}