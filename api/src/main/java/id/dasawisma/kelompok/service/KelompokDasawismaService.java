package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.KelompokDasawisma;
import id.dasawisma.kelompok.repository.BangunanRepository;
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
  private final BangunanRepository bangunanRepository;

  public Page<KelompokDasawisma> findAll(Specification<KelompokDasawisma> kelompokDasawismaSpecification, Pageable paging) {
    return kelompokDasawismaRepository.findAll(kelompokDasawismaSpecification, paging);
  }

  public Iterable<KelompokDasawisma> findAllByOrderByNamaKelompok() {
    return kelompokDasawismaRepository.findAllByOrderByNamaKelompok();
  }

  public Iterable<KelompokDasawisma> findAllByPetugasKelompok_NikOrderByNamaKelompok(String nik) {
    return kelompokDasawismaRepository.findAllByPetugasKelompok_NikOrderByNamaKelompok(nik);
  }

  public Iterable<KelompokDasawisma> findAllByRtKelompok_KodeRtOrderByNamaKelompok(String kodeRt) {
    return kelompokDasawismaRepository.findAllByRtKelompok_KodeRtOrderByNamaKelompok(kodeRt);
  }

  public Iterable<KelompokDasawisma> findAllByRtKelompok_Rw_Kelurahan_KodeKelurahanOrderByNamaKelompok(String kodeKelurahan) {
    return kelompokDasawismaRepository.findAllByRtKelompok_Rw_Kelurahan_KodeKelurahanOrderByNamaKelompok(kodeKelurahan);
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

  public Integer countBangunanByIdKelompok(Long idKelompok) {
    return bangunanRepository.countAllByKelompokBangunan_Id(idKelompok);
  }

  public String getKelompokNextNumber(String kodeRt) {
    KelompokDasawisma kelompokDasawisma = kelompokDasawismaRepository.findFirstByRtKelompok_KodeRtOrderByIdDesc(kodeRt);
    String nextNumberString = "001";
    if (kelompokDasawisma != null) {
      String[] splNamaKelompok = kelompokDasawisma.getNamaKelompok().split("\\.");
      int lastNumber = Integer.parseInt(splNamaKelompok[3]) + 1;
      if (lastNumber >= 1 && lastNumber <= 9)
        nextNumberString = "00" + lastNumber;
      else if (lastNumber >= 10 && lastNumber <= 99)
        nextNumberString = "0" + lastNumber;
      else nextNumberString = Integer.toString(lastNumber);
    }
    return nextNumberString;
  }
}