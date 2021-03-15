package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.RumahTangga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface RumahTanggaRepository extends JpaRepository<RumahTangga, Long>, JpaSpecificationExecutor<RumahTangga> {
  RumahTangga findRumahTanggaById(Long id);

  Iterable<RumahTangga> findAllByBangunanRumahTangga_IdOrderByIdDesc(@NotBlank(message = "Id Bangunan harus diisi.") Long idBangunan);
}