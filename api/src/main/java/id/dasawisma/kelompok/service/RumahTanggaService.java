package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.RumahTangga;
import id.dasawisma.kelompok.repository.RumahTanggaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RumahTanggaService {
  private final RumahTanggaRepository rumahTanggaRepository;

  public Page<RumahTangga> findAll(Specification<RumahTangga> rumahTanggaSpecification, Pageable paging) {
    return rumahTanggaRepository.findAll(rumahTanggaSpecification, paging);
  }

  public Iterable<RumahTangga> findAllByBangunanRumahTangga_IdOrderByIdDesc(Long idBangunan) {
    return rumahTanggaRepository.findAllByBangunanRumahTangga_IdOrderByIdDesc(idBangunan);
  }

  public RumahTangga findById(Long id) {
    RumahTangga rumahTangga = rumahTanggaRepository.findRumahTanggaById(id);
    if (rumahTangga == null) {
      throw new ApiRequestException("Id RumahTangga '" + id.toString() + "' tidak ada");
    }
    return rumahTangga;
  }

  public RumahTangga saveOrUpdate(RumahTangga rumahTangga) {
    return rumahTanggaRepository.save(rumahTangga);
  }

  public void deleteById(Long id) {
    rumahTanggaRepository.delete(findById(id));
  }
}