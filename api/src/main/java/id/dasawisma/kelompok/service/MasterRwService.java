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

  public Iterable<MasterRw> findAllByKelurahan_KodeKelurahanStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(String kodeKelurahan) {
    return rwRepository.findAllByKelurahan_KodeKelurahanStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(kodeKelurahan);
  }

  public Iterable<MasterRw> findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(String kodeKelurahan) {
    return rwRepository.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(kodeKelurahan);
  }

  public Iterable<MasterRw> findAllByKodeRw(String kodeRw) {
    return rwRepository.findAllByKodeRw(kodeRw);
  }

  public Iterable<MasterRw> findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc() {
    return rwRepository.findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc();
  }

  public MasterRw findByKode(String kodeRw) {
    MasterRw masterRw = rwRepository.findMasterRwByKodeRw(kodeRw);
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