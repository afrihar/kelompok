package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterKelurahan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterKelurahanRepository extends JpaRepository<MasterKelurahan, Long>, JpaSpecificationExecutor<MasterKelurahan> {
  Iterable<MasterKelurahan> findAllByOrderByNamaKelurahanAsc();

  Iterable<MasterKelurahan> findAllByKodeKelurahanStartingWith(@NotBlank(message = "Kode Kelurahan harus diisi.") String kodeKelurahan);

  MasterKelurahan findByKodeKelurahan(String kodeKelurahan);

  MasterKelurahan findByKodeKelurahanCapil(String kodeKelurahanCapil);
}
