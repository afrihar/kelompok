package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.Keluarga;
import id.dasawisma.kelompok.repository.KeluargaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeluargaService {
  private final KeluargaRepository keluargaRepository;

  public Page<Keluarga> findAll(Specification<Keluarga> keluargaSpecification, Pageable paging) {
    return keluargaRepository.findAll(keluargaSpecification, paging);
  }

  public Iterable<Keluarga> findAllByRumahTanggaKeluarga_IdOrderByIdDesc(Long idRumahTangga) {
    return keluargaRepository.findAllByRumahTanggaKeluarga_IdOrderByIdDesc(idRumahTangga);
  }

  public Keluarga findById(Long id) {
    Keluarga keluarga = keluargaRepository.findKeluargaById(id);
    if (keluarga == null) {
      throw new ApiRequestException("Id Keluarga '" + id.toString() + "' tidak ada");
    }
    return keluarga;
  }

  public Keluarga saveOrUpdate(Keluarga keluarga) {
    return keluargaRepository.save(keluarga);
  }

  public void deleteById(Long id) {
    keluargaRepository.delete(findById(id));
  }
}