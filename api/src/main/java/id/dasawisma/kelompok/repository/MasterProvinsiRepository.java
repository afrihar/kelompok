package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterProvinsi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterProvinsiRepository extends JpaRepository<MasterProvinsi, Long>, JpaSpecificationExecutor<MasterProvinsi> {
  Iterable<MasterProvinsi> findAllByOrderByNamaProvinsiAsc();

  Iterable<MasterProvinsi> findProvinsiByKodeProvinsi(String kodeProvinsi);

  MasterProvinsi findByKodeProvinsi(String kodeProvinsi);

  MasterProvinsi findByKodeProvinsiCapil(String kodeProvinsiCapil);
}