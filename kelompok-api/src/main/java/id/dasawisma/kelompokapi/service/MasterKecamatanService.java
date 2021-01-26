package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterKecamatan;
import id.dasawisma.kelompokapi.repository.MasterKecamatanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterKecamatanService {
  private final MasterKecamatanRepository kecamatanRepository;

  public Page<MasterKecamatan> findAll(Specification<MasterKecamatan> kotaSpecification, Pageable paging) {
    return kecamatanRepository.findAll(kotaSpecification, paging);
  }

  public Iterable<MasterKecamatan> findAllByOrderByNamaKecamatanAsc() {
    return kecamatanRepository.findAllByOrderByNamaKecamatanAsc();
  }

  public Iterable<MasterKecamatan> findAllByKodeKecamatanStartingWith(String kodeKecamatan) {
    return kecamatanRepository.findAllByKodeKecamatanStartingWith(kodeKecamatan);
  }

  public MasterKecamatan findByKode(String kodeKecamatan) {
    MasterKecamatan masterKecamatan = kecamatanRepository.findByKodeKecamatan(kodeKecamatan);
    if (masterKecamatan == null) {
      throw new ApiRequestException("Kode Kecamatan '" + kodeKecamatan + "' tidak tersedia");
    }
    return masterKecamatan;
  }

  public MasterKecamatan findByKodeCapil(String kodeKecamatanCapil) {
    MasterKecamatan masterKecamatan = kecamatanRepository.findByKodeKecamatanCapil(kodeKecamatanCapil);
    if (masterKecamatan == null) {
      throw new ApiRequestException("Kode Kecamatan Capil '" + kodeKecamatanCapil + "' tidak tersedia");
    }
    return masterKecamatan;
  }

  public MasterKecamatan saveOrUpdate(MasterKecamatan kota) {
    try {
      return kecamatanRepository.save(kota);
    } catch (Exception e) {
      throw new ApiRequestException(e.getCause().getCause().getLocalizedMessage());
    }
  }

  public void deleteByKode(String idKecamatan) {
    kecamatanRepository.delete(findByKode(idKecamatan));
  }
}
