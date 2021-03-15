package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.Keluarga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface KeluargaRepository extends JpaRepository<Keluarga, Long>, JpaSpecificationExecutor<Keluarga> {
  Keluarga findKeluargaById(Long id);

  Iterable<Keluarga> findAllByRumahTanggaKeluarga_IdOrderByIdDesc(@NotBlank(message = "Id Rumah Tangga harus diisi.") Long idRumahTangga);
}