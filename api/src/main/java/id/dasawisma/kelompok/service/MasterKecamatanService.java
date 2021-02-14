package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterKecamatan;
import id.dasawisma.kelompok.repository.MasterKecamatanRepository;
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

  public Iterable<MasterKecamatan> findAllByKota_KodeKotaStartingWithOrderByNamaKecamatanAsc(String kodeKota) {
    return kecamatanRepository.findAllByKota_KodeKotaStartingWithOrderByNamaKecamatanAsc(kodeKota);
  }

  public Iterable<MasterKecamatan> findAllByKota_KodeKotaOrderByNamaKecamatanAsc(String kodeKota) {
    return kecamatanRepository.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(kodeKota);
  }

  public Iterable<MasterKecamatan> findAllByKodeKecamatan(String kodeKecamatan) {
    return kecamatanRepository.findAllByKodeKecamatan(kodeKecamatan);
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