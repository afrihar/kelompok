package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.MasterKecamatan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterKecamatanRepository extends JpaRepository<MasterKecamatan, Long>, JpaSpecificationExecutor<MasterKecamatan> {
  Iterable<MasterKecamatan> findAllByOrderByNamaKecamatanAsc();

  Iterable<MasterKecamatan> findAllByKodeKecamatanStartingWith(@NotBlank(message = "Kode Kecamatan harus diisi.") String kodeKecamatan);

  MasterKecamatan findByKodeKecamatan(String kodeKecamatan);

  MasterKecamatan findByKodeKecamatanCapil(String kodeKecamatanCapil);
}
