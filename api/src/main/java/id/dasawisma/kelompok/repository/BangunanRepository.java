package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.Bangunan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface BangunanRepository extends JpaRepository<Bangunan, Long>, JpaSpecificationExecutor<Bangunan> {
  Bangunan findBangunanById(Long id);

  Bangunan findFirstByKelompokBangunan_IdOrderByNoUrutDesc(Long idKelompok);

  Integer countAllByKelompokBangunan_Id(@NotBlank(message = "Id Kelompok harus diisi.") Long idKelompok);

  Iterable<Bangunan> findAllByKelompokBangunan_IdOrderByNoUrut(@NotBlank(message = "Id Kelompok harus diisi.") Long idKelompok);
}