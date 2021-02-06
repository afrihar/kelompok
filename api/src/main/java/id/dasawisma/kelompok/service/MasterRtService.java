package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterRt;
import id.dasawisma.kelompok.repository.MasterRtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterRtService {
  private final MasterRtRepository rtRepository;

  public Page<MasterRt> findAll(Specification<MasterRt> rtSpecification, Pageable paging) {
    return rtRepository.findAll(rtSpecification, paging);
  }

  public Iterable<MasterRt> findAllByKodeRtStartingWithOrderByRw_KodeRwAscKodeRtAsc(String kodeRt) {
    return rtRepository.findAllByKodeRtStartingWithOrderByRw_KodeRwAscKodeRtAsc(kodeRt);
  }

  public Iterable<MasterRt> findAllByOrderByRw_KodeRwAscLabelRtAsc() {
    return rtRepository.findAllByOrderByRw_KodeRwAscLabelRtAsc();
  }

  public MasterRt saveOrUpdate(MasterRt rt) {
    return rtRepository.save(rt);
  }

  public MasterRt findByKode(String kodeRt) {
    MasterRt masterRt = rtRepository.findByKodeRt(kodeRt);
    if (masterRt == null) {
      throw new ApiRequestException("Kode Rt '" + kodeRt + "' tidak tersedia");
    }
    return masterRt;
  }

  public void deleteRtByKode(String kodeRt) {
    rtRepository.delete(findByKode(kodeRt));
  }
}
