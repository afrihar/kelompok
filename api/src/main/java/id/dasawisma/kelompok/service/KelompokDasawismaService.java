package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.KelompokDasawisma;
import id.dasawisma.kelompok.repository.KelompokDasawismaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KelompokDasawismaService {
  private final KelompokDasawismaRepository kelompokDasawismaRepository;

  public Page<KelompokDasawisma> findAll(Specification<KelompokDasawisma> kelompokDasawismaSpecification, Pageable paging) {
    return kelompokDasawismaRepository.findAll(kelompokDasawismaSpecification, paging);
  }

  public Iterable<KelompokDasawisma> findAllByPetugasKelompok_NikOrderByNamaKelompok(String nik) {
    return kelompokDasawismaRepository.findAllByPetugasKelompok_NikOrderByNamaKelompok(nik);
  }

  public Iterable<KelompokDasawisma> findAllByRtKelompok_KodeRtOrderByNamaKelompok(String kodeRt) {
    return kelompokDasawismaRepository.findAllByRtKelompok_KodeRtOrderByNamaKelompok(kodeRt);
  }

  public KelompokDasawisma findById(Long id) {
    KelompokDasawisma kelompokDasawisma = kelompokDasawismaRepository.findKelompokDasawismaById(id);
    if (kelompokDasawisma == null) {
      throw new ApiRequestException("Id Kelompok Dasawisma '" + id.toString() + "' tidak ada");
    }
    return kelompokDasawisma;
  }

  public KelompokDasawisma saveOrUpdate(KelompokDasawisma kelompokDasawisma) {
    return kelompokDasawismaRepository.save(kelompokDasawisma);
  }

  public void deleteById(Long id) {
    kelompokDasawismaRepository.delete(findById(id));
  }

  public Integer countAllByRtKelompok(String kodeRt) {
    return kelompokDasawismaRepository.countAllByRtKelompok_KodeRt(kodeRt);
  }
}