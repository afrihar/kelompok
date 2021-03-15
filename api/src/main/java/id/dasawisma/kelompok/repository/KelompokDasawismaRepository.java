package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.KelompokDasawisma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Repository
public interface KelompokDasawismaRepository extends JpaRepository<KelompokDasawisma, Long>, JpaSpecificationExecutor<KelompokDasawisma> {
  KelompokDasawisma findKelompokDasawismaById(Long id);

  Iterable<KelompokDasawisma> findAllByOrderByNamaKelompok();

  Iterable<KelompokDasawisma> findAllByPetugasKelompok_NikOrderByNamaKelompok(@NotBlank(message = "NIK harus diisi.") @Size(min = 16, max = 16, message = "NIK Harus 16 Karakter") String nik);

  Iterable<KelompokDasawisma> findAllByRtKelompok_KodeRtOrderByNamaKelompok(@NotBlank(message = "Kode RT harus diisi.") String rtKelompok_kodeRt);

  Iterable<KelompokDasawisma> findAllByRtKelompok_Rw_Kelurahan_KodeKelurahanOrderByNamaKelompok(@NotBlank(message = "Kode Kelurahan harus diisi.") String kodeKelurahan);

  Integer countAllByRtKelompok_KodeRt(@NotBlank(message = "Kode RT harus diisi.") String rtKelompok_kodeRt);

  KelompokDasawisma findFirstByRtKelompok_KodeRtOrderByIdDesc(@NotBlank(message = "Kode RT harus diisi.") String rtKelompok_kodeRt);
}