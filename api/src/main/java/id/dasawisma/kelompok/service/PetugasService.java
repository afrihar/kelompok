package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.Petugas;
import id.dasawisma.kelompok.repository.PetugasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetugasService {
  private final PetugasRepository petugasRepository;

  public Page<Petugas> findAll(Specification<Petugas> petugasSpecification, Pageable paging) {
    return petugasRepository.findAll(petugasSpecification, paging);
  }

  public Petugas findByNik(String nik) {
    Petugas petugas = petugasRepository.findByNik(nik);
    if (petugas == null) {
      throw new ApiRequestException("NIK Petugas '" + nik + "' tidak ada");
    }
    return petugas;
  }

  public Petugas findByEmail(String email) {
    Petugas petugas = petugasRepository.findByEmail(email);
    if (petugas == null) {
      throw new ApiRequestException("Email Petugas '" + email + "' tidak ada");
    }
    return petugas;
  }

  public Petugas findByNoRekening(String noRekening) {
    Petugas petugas = petugasRepository.findByNoRekening(noRekening);
    if (petugas == null) {
      throw new ApiRequestException("Email Petugas '" + noRekening + "' tidak ada");
    }
    return petugas;
  }

  public Petugas saveOrUpdate(Petugas Petugas) {
    return petugasRepository.save(Petugas);
  }

  public void deleteByNik(String nikPetugas) {
    petugasRepository.delete(findByNik(nikPetugas));
  }
}