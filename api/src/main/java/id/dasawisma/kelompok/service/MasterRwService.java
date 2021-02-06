package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterRw;
import id.dasawisma.kelompok.repository.MasterRwRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterRwService {
  private final MasterRwRepository rwRepository;

  public Page<MasterRw> findAll(Specification<MasterRw> rwSpecification, Pageable paging) {
    return rwRepository.findAll(rwSpecification, paging);
  }

  public Iterable<MasterRw> findAllByKodeRwStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(String kodeRw) {
    return rwRepository.findAllByKodeRwStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(kodeRw);
  }

  public Iterable<MasterRw> findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc() {
    return rwRepository.findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc();
  }

  public MasterRw findByKode(String kodeRw) {
    MasterRw masterRw = rwRepository.findByKodeRw(kodeRw);
    if (masterRw == null) {
      throw new ApiRequestException("Kode Rw '" + kodeRw + "' tidak tersedia");
    }
    return masterRw;
  }

  public MasterRw saveOrUpdate(MasterRw masterRw) {
    return rwRepository.save(masterRw);
  }

  public void deleteByKode(String kodeRw) {
    rwRepository.delete(findByKode(kodeRw));
  }
}