package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.KetuaDasawisma;
import id.dasawisma.kelompokapi.repository.KetuaDasawismaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KetuaDasawismaService {
  private final KetuaDasawismaRepository ketuaDasawismaRepository;

  public Page<KetuaDasawisma> findAll(Specification<KetuaDasawisma> kaderSpecification, Pageable paging) {
    return ketuaDasawismaRepository.findAll(kaderSpecification, paging);
  }

  public Iterable<KetuaDasawisma> findAllByNik(String nikKetuaDasawisma) {
    return ketuaDasawismaRepository.findAllByPetugas_Nik(nikKetuaDasawisma);
  }

  public Iterable<KetuaDasawisma> findAllByRtTugas(String kodeRt) {
    return ketuaDasawismaRepository.findAllByRt_KodeRt(kodeRt);
  }

  public KetuaDasawisma findByNoKader(String noKader) {
    KetuaDasawisma ketuaDasawisma = ketuaDasawismaRepository.findByNoKader(noKader);
    if (ketuaDasawisma == null) {
      throw new ApiRequestException("Nomor Kader '" + noKader + "' tidak ada");
    }
    return ketuaDasawisma;
  }

  public KetuaDasawisma saveOrUpdate(KetuaDasawisma KetuaDasawisma) {
    return ketuaDasawismaRepository.save(KetuaDasawisma);
  }

  public void deleteByNoKader(String noKader) {
    ketuaDasawismaRepository.delete(findByNoKader(noKader));
  }
}