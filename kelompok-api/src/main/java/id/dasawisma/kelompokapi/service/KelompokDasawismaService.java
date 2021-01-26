package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.KelompokDasawisma;
import id.dasawisma.kelompokapi.repository.KelompokDasawismaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KelompokDasawismaService {
  private final KelompokDasawismaRepository kelompokDasawismaRepository;

  public Page<KelompokDasawisma> findAll(Specification<KelompokDasawisma> kaderSpecification, Pageable paging) {
    return kelompokDasawismaRepository.findAll(kaderSpecification, paging);
  }

  public Iterable<KelompokDasawisma> findAllByRtTugas(String kodeRt) {
    return kelompokDasawismaRepository.findAllByRt_KodeRt(kodeRt);
  }

  public KelompokDasawisma findById(long idKelompokDasawisma) {
    KelompokDasawisma kelompokDasawisma = kelompokDasawismaRepository.findById(idKelompokDasawisma);
    if (kelompokDasawisma == null) {
      throw new ApiRequestException("ID Kelompok Dasawisma '" + idKelompokDasawisma + "' tidak ada");
    }
    return kelompokDasawisma;
  }

  public KelompokDasawisma findByNoKader(String noKader) {
    KelompokDasawisma kelompokDasawisma = kelompokDasawismaRepository.findByKetuaDasawisma_NoKader(noKader);
    if (kelompokDasawisma == null) {
      throw new ApiRequestException("Nomor Kader '" + noKader + "' tidak ada");
    }
    return kelompokDasawisma;
  }

  public KelompokDasawisma saveOrUpdate(KelompokDasawisma KelompokDasawisma) {
    return kelompokDasawismaRepository.save(KelompokDasawisma);
  }

  public void deleteById(long idKelompokDasawisma) {
    kelompokDasawismaRepository.delete(findById(idKelompokDasawisma));
  }
}