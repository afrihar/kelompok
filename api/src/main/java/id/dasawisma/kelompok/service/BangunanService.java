package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.Bangunan;
import id.dasawisma.kelompok.repository.BangunanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BangunanService {
  private final BangunanRepository bangunanRepository;

  public Page<Bangunan> findAll(Specification<Bangunan> bangunanSpecification, Pageable paging) {
    return bangunanRepository.findAll(bangunanSpecification, paging);
  }

  public Iterable<Bangunan> findAllByKelompokBangunan_IdOrderByNoUrut(Long idKelompok) {
    return bangunanRepository.findAllByKelompokBangunan_IdOrderByNoUrut(idKelompok);
  }

  public Bangunan findById(Long id) {
    Bangunan bangunan = bangunanRepository.findBangunanById(id);
    if (bangunan == null) {
      throw new ApiRequestException("Id Bangunan '" + id.toString() + "' tidak ada");
    }
    return bangunan;
  }

  public Integer getLastNoUrutByIdKelompok(Long idKelompok) {
    Integer lastNoUrut;
    Bangunan bangunan = bangunanRepository.findFirstByKelompokBangunan_IdOrderByNoUrutDesc(idKelompok);
    if (bangunan == null || bangunan.getNoUrut() == null) lastNoUrut = 0;
    else lastNoUrut = bangunan.getNoUrut();
    return lastNoUrut;
  }

  public Bangunan saveOrUpdate(Bangunan bangunan) {
    return bangunanRepository.save(bangunan);
  }

  public void deleteById(Long id) {
    bangunanRepository.delete(findById(id));
  }
}