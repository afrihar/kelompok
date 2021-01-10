package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterProvinsi;
import id.dasawisma.kelompokapi.repository.MasterProvinsiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterProvinsiService {
  private final MasterProvinsiRepository masterProvinsiRepository;

  public Page<MasterProvinsi> findAll(Specification<MasterProvinsi> provinsiSpecification, Pageable paging) {
    return masterProvinsiRepository.findAll(provinsiSpecification, paging);
  }

  public Iterable<MasterProvinsi> findAllByOrderByNamaProvinsiAsc() {
    return masterProvinsiRepository.findAllByOrderByNamaProvinsiAsc();
  }

  public MasterProvinsi findProvinsiById(long idProvinsi) {
    MasterProvinsi masterProvinsi = masterProvinsiRepository.findById(idProvinsi);
    if (masterProvinsi == null) {
      throw new ApiRequestException("ID Provinsi '" + idProvinsi + "' tidak ada");
    }
    return masterProvinsi;
  }

  public MasterProvinsi findProvinsiByKode(String kodeProvinsi) {
    MasterProvinsi masterProvinsi = masterProvinsiRepository.findByKodeProvinsi(kodeProvinsi);
    if (masterProvinsi == null) {
      throw new ApiRequestException("Kode Provinsi '" + kodeProvinsi + "' tidak tersedia");
    }
    return masterProvinsi;
  }

  public MasterProvinsi findProvinsiByKodeCapil(String kodeProvinsiCapil) {
    MasterProvinsi masterProvinsi = masterProvinsiRepository.findByKodeProvinsiCapil(kodeProvinsiCapil);
    if (masterProvinsi == null) {
      throw new ApiRequestException("Kode Provinsi Capil '" + kodeProvinsiCapil + "' tidak tersedia");
    }
    return masterProvinsi;
  }

  public MasterProvinsi saveOrUpdateProvinsi(MasterProvinsi provinsi) {
    try {
      return masterProvinsiRepository.save(provinsi);
    } catch (Exception e) {
      throw new ApiRequestException(e.getCause().getCause().getLocalizedMessage());
    }
  }

  public void deleteProvinsiById(long idProvinsi) {
    masterProvinsiRepository.delete(findProvinsiById(idProvinsi));
  }
}
