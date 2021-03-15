package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.Individu;
import id.dasawisma.kelompok.repository.IndividuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IndividuService {
  private final IndividuRepository individuRepository;

  public Page<Individu> findAll(Specification<Individu> individuSpecification, Pageable paging) {
    return individuRepository.findAll(individuSpecification, paging);
  }

  public Iterable<Individu> findAllByKeluargaIndividu_IdOrderByIdDesc(Long idKeluarga) {
    return individuRepository.findAllByKeluargaIndividu_IdOrderByNikDesc(idKeluarga);
  }

  public Individu findByNik(String nik) {
    Individu individu = individuRepository.findIndividuByNik(nik);
    if (individu == null) {
      throw new ApiRequestException("Id Individu '" + nik + "' tidak ada");
    }
    return individu;
  }

  public Individu saveOrUpdate(Individu individu) {
    return individuRepository.save(individu);
  }

  public void deleteByNik(String nik) {
    individuRepository.delete(findByNik(nik));
  }
}