package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterKecamatan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterKecamatanRepository extends JpaRepository<MasterKecamatan, Long>, JpaSpecificationExecutor<MasterKecamatan> {
  Iterable<MasterKecamatan> findAllByOrderByNamaKecamatanAsc();

  Iterable<MasterKecamatan> findAllByKota_KodeKotaOrderByNamaKecamatanAsc(@NotBlank(message = "Kode Kota harus diisi.") String kota_kodeKota);

  Iterable<MasterKecamatan> findAllByKota_KodeKotaStartingWithOrderByNamaKecamatanAsc(@NotBlank(message = "Kode Kota harus diisi.") String kota_kodeKota);

  Iterable<MasterKecamatan> findAllByKodeKecamatan(@NotBlank(message = "Kode Kecamatan harus diisi.") String kodeKecamatan);

  MasterKecamatan findByKodeKecamatan(String kodeKecamatan);

  MasterKecamatan findByKodeKecamatanCapil(String kodeKecamatanCapil);
}
