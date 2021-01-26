package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.KelompokDasawisma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface KelompokDasawismaRepository extends JpaRepository<KelompokDasawisma, Long>, JpaSpecificationExecutor<KelompokDasawisma> {
  Iterable<KelompokDasawisma> findAllByRt_KodeRt(@NotBlank(message = "Kode Rt harus diisi.") String kodeRt);

  KelompokDasawisma findById(long idKelompokDasawisma);

  KelompokDasawisma findByKetuaDasawisma_NoKader(String noKader);
}