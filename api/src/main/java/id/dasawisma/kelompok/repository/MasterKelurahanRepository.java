package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterKelurahan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface MasterKelurahanRepository extends JpaRepository<MasterKelurahan, Long>, JpaSpecificationExecutor<MasterKelurahan> {
  Iterable<MasterKelurahan> findAllByOrderByNamaKelurahanAsc();

  Iterable<MasterKelurahan> findAllByKecamatan_KodeKecamatanStartingWithOrderByNamaKelurahan(String kodeKecamatan);

  Iterable<MasterKelurahan> findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(String kodeKecamatan);

  Iterable<MasterKelurahan> findAllByKodeKelurahan(String kodeKelurahan);

  MasterKelurahan findByKodeKelurahan(String kodeKelurahan);

  MasterKelurahan findByKodeKelurahanCapil(String kodeKelurahanCapil);
}
