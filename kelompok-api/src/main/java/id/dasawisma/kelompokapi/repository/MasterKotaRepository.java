package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.MasterKota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface MasterKotaRepository extends JpaRepository<MasterKota, Long>, JpaSpecificationExecutor<MasterKota> {
  Iterable<MasterKota> findAllByOrderByNamaKotaAsc();

  Iterable<MasterKota> findAllByKodeKotaStartingWith(@NotBlank(message = "Kode Kota harus diisi.") String kodeKota);

  MasterKota findByKodeKota(String kodeKota);

  MasterKota findByKodeKotaCapil(String kodeKotaCapil);
}
