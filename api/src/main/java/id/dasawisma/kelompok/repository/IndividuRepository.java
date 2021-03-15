package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.Individu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface IndividuRepository extends JpaRepository<Individu, Long>, JpaSpecificationExecutor<Individu> {
  Individu findIndividuByNik(String id);

  Iterable<Individu> findAllByKeluargaIndividu_IdOrderByNikDesc(@NotBlank(message = "Id Keluarga harus diisi.") Long idKeluarga);
}