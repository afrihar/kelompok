package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.KetuaDasawisma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.NotBlank;

@Repository
public interface KetuaDasawismaRepository extends JpaRepository<KetuaDasawisma, Long>, JpaSpecificationExecutor<KetuaDasawisma> {
  Iterable<KetuaDasawisma> findAllByPetugas_Nik(@NotBlank(message = "NIK harus diisi.") String nikKetuaDasawisma);

  Iterable<KetuaDasawisma> findAllByRt_KodeRt(@NotBlank(message = "Kode Rt harus diisi.") String kodeRt);

  KetuaDasawisma findByNoKader(String noKader);
}