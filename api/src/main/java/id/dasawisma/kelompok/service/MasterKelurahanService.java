package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterKelurahan;
import id.dasawisma.kelompok.repository.MasterKelurahanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterKelurahanService {
  private final MasterKelurahanRepository kelurahanRepository;

  public Page<MasterKelurahan> findAll(Specification<MasterKelurahan> kecamatanSpecification, Pageable paging) {
    return kelurahanRepository.findAll(kecamatanSpecification, paging);
  }

  public Iterable<MasterKelurahan> findAllByOrderByNamaKelurahanAsc() {
    return kelurahanRepository.findAllByOrderByNamaKelurahanAsc();
  }

  public Iterable<MasterKelurahan> findAllByKecamatan_KodeKecamatanStartingWithOrderByNamaKelurahan(String kodeKecamatan) {
    return kelurahanRepository.findAllByKecamatan_KodeKecamatanStartingWithOrderByNamaKelurahan(kodeKecamatan);
  }

  public Iterable<MasterKelurahan> findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(String kodeKecamatan) {
    return kelurahanRepository.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(kodeKecamatan);
  }

  public Iterable<MasterKelurahan> findAllByKodeKelurahan(String kodeKelurahan) {
    return kelurahanRepository.findAllByKodeKelurahan(kodeKelurahan);
  }

  public MasterKelurahan findByKode(String kodeKelurahan) {
    MasterKelurahan masterKelurahan = kelurahanRepository.findByKodeKelurahan(kodeKelurahan);
    if (masterKelurahan == null) {
      throw new ApiRequestException("Kode Kelurahan '" + kodeKelurahan + "' tidak tersedia");
    }
    return masterKelurahan;
  }

  public MasterKelurahan findByKodeCapil(String kodeKelurahanCapil) {
    MasterKelurahan masterKelurahan = kelurahanRepository.findByKodeKelurahanCapil(kodeKelurahanCapil);
    if (masterKelurahan == null) {
      throw new ApiRequestException("Kode Kelurahan Capil '" + kodeKelurahanCapil + "' tidak tersedia");
    }
    return masterKelurahan;
  }

  public MasterKelurahan saveOrUpdate(MasterKelurahan kecamatan) {
    try {
      return kelurahanRepository.save(kecamatan);
    } catch (Exception e) {
      throw new ApiRequestException(e.getCause().getCause().getLocalizedMessage());
    }
  }

  public void deleteByKode(String kodeKelurahan) {
    kelurahanRepository.delete(findByKode(kodeKelurahan));
  }
}
