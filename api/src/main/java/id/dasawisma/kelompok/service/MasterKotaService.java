package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterKota;
import id.dasawisma.kelompok.repository.MasterKotaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MasterKotaService {
  private final MasterKotaRepository kotaRepository;

  public Page<MasterKota> findAll(Specification<MasterKota> provinsiSpecification, Pageable paging) {
    return kotaRepository.findAll(provinsiSpecification, paging);
  }

  public Iterable<MasterKota> findAllByOrderByNamaKotaAsc() {
    return kotaRepository.findAllByOrderByNamaKotaAsc();
  }

  public Iterable<MasterKota> findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(String kodeProvinsi) {
    return kotaRepository.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(kodeProvinsi);
  }

  public Iterable<MasterKota> findAllByKodeKota(String kodeKota) {
    return kotaRepository.findAllByKodeKota(kodeKota);
  }

  public MasterKota findByKode(String kodeKota) {
    MasterKota masterKota = kotaRepository.findByKodeKota(kodeKota);
    if (masterKota == null) {
      throw new ApiRequestException("Kode Kota '" + kodeKota + "' tidak tersedia");
    }
    return masterKota;
  }

  public MasterKota findByKodeCapil(String kodeKotaCapil) {
    MasterKota masterKota = kotaRepository.findByKodeKotaCapil(kodeKotaCapil);
    if (masterKota == null) {
      throw new ApiRequestException("Kode Kota Capil '" + kodeKotaCapil + "' tidak tersedia");
    }
    return masterKota;
  }

  public MasterKota saveOrUpdate(MasterKota provinsi) {
    try {
      return kotaRepository.save(provinsi);
    } catch (Exception e) {
      throw new ApiRequestException(e.getCause().getCause().getLocalizedMessage());
    }
  }

  public void deleteByKode(String kodeKota) {
    kotaRepository.delete(findByKode(kodeKota));
  }
}
