package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterKota;
import id.dasawisma.kelompokapi.repository.MasterKotaRepository;
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

  public Iterable<MasterKota> findAllByKodeKotaStartingWith(String kodeKota) {
    return kotaRepository.findAllByKodeKotaStartingWith(kodeKota);
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
