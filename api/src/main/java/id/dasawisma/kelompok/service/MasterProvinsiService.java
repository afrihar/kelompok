package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterProvinsi;
import id.dasawisma.kelompok.repository.MasterProvinsiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterProvinsiService {
  private final MasterProvinsiRepository provinsiRepository;

  public Page<MasterProvinsi> findAll(Specification<MasterProvinsi> provinsiSpecification, Pageable paging) {
    return provinsiRepository.findAll(provinsiSpecification, paging);
  }

  public Iterable<MasterProvinsi> findAllByOrderByNamaProvinsiAsc() {
    return provinsiRepository.findAllByOrderByNamaProvinsiAsc();
  }

  public Iterable<MasterProvinsi> findProvinsiByKodeProvinsi(String kodeProvinsi) {
    return provinsiRepository.findProvinsiByKodeProvinsi(kodeProvinsi);
  }

  public MasterProvinsi findByKode(String kodeProvinsi) {
    MasterProvinsi masterProvinsi = provinsiRepository.findByKodeProvinsi(kodeProvinsi);
    if (masterProvinsi == null) {
      throw new ApiRequestException("Kode Provinsi '" + kodeProvinsi + "' tidak tersedia");
    }
    return masterProvinsi;
  }

  public MasterProvinsi findByKodeCapil(String kodeProvinsiCapil) {
    MasterProvinsi masterProvinsi = provinsiRepository.findByKodeProvinsiCapil(kodeProvinsiCapil);
    if (masterProvinsi == null) {
      throw new ApiRequestException("Kode Provinsi Capil '" + kodeProvinsiCapil + "' tidak tersedia");
    }
    return masterProvinsi;
  }

  public MasterProvinsi saveOrUpdate(MasterProvinsi provinsi) {
    try {
      return provinsiRepository.save(provinsi);
    } catch (Exception e) {
      throw new ApiRequestException(e.getCause().getCause().getLocalizedMessage());
    }
  }

  public void deleteByKode(String kodeProvinsi) {
    provinsiRepository.delete(findByKode(kodeProvinsi));
  }
}
