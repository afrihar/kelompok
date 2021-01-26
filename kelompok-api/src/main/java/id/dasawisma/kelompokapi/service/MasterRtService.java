package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterRt;
import id.dasawisma.kelompokapi.repository.MasterRtRepository;
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

  public Iterable<MasterRt> findAllByKodeRtStartingWithOrderByRw_KodeRwAsc(String kodeRt) {
    return rtRepository.findAllByKodeRtStartingWithOrderByRw_KodeRwAsc(kodeRt);
  }

  public Iterable<MasterRt> findAllByOrderByRw_KodeRwAscLabelRtAsc() {
    return rtRepository.findAllByOrderByRw_KodeRwAscLabelRtAsc();
  }

  public Iterable<MasterRt> findAllByKodeRtStartingWith(String kodeRw) {
    return rtRepository.findAllByKodeRtStartingWith(kodeRw);
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
