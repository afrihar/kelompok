package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.MasterKota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterKotaRepository extends JpaRepository<MasterKota, Long>, JpaSpecificationExecutor<MasterKota> {
  Iterable<MasterKota> findAllByOrderByNamaKotaAsc();

  Iterable<MasterKota> findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(@NotBlank(message = "Kode Provinsi harus diisi.") String provinsi_kodeProvinsi);

  Iterable<MasterKota> findAllByKodeKota(@NotBlank(message = "Kode Kota harus diisi.") String kodeKota);

  MasterKota findByKodeKota(String kodeKota);

  MasterKota findByKodeKotaCapil(String kodeKotaCapil);
}
