package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.*;
import id.dasawisma.kelompok.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OptionsService {
  private final OptionAgamaRepository optionAgamaRepository;
  private final OptionHubunganEmergencyRepository optionHubunganEmergencyRepository;
  private final OptionPekerjaanRepository optionPekerjaanRepository;
  private final OptionPendidikanRepository optionPendidikanRepository;
  private final OptionStatusKepemilikanRumahRepository optionStatusKepemilikanRumahRepository;
  private final OptionStatusPekerjaanRepository optionStatusPekerjaanRepository;
  private final OptionStatusPernikahanRepository optionStatusPernikahanRepository;

  public Iterable<OptionAgama> findAllAgama() {
    return optionAgamaRepository.findAllByOrderById();
  }

  public OptionAgama findAgamaById(Long idAgama) {
    OptionAgama agama = optionAgamaRepository.findOptionAgamaById(idAgama);
    if (agama == null) {
      throw new ApiRequestException("Id Agama '" + idAgama + "' tidak ada");
    }
    return agama;
  }

  public Iterable<OptionHubunganEmergency> findAllHubunganEmergency() {
    return optionHubunganEmergencyRepository.findAllByOrderById();
  }

  public OptionHubunganEmergency findHubunganEmergencyById(Long idHubunganEmergency) {
    OptionHubunganEmergency hubunganEmergency = optionHubunganEmergencyRepository.findOptionHubunganEmergencyById(idHubunganEmergency);
    if (hubunganEmergency == null) {
      throw new ApiRequestException("Id Hubungan Emergency '" + idHubunganEmergency + "' tidak ada");
    }
    return hubunganEmergency;
  }

  public Iterable<OptionPekerjaan> findAllPekerjaan() {
    return optionPekerjaanRepository.findAllByOrderById();
  }

  public OptionPekerjaan findPekerjaanById(Long idPekerjaan) {
    OptionPekerjaan pekerjaan = optionPekerjaanRepository.findOptionPekerjaanById(idPekerjaan);
    if (pekerjaan == null) {
      throw new ApiRequestException("Id Pekerjaan '" + idPekerjaan + "' tidak ada");
    }
    return pekerjaan;
  }

  public Iterable<OptionPendidikan> findAllPendidikan() {
    return optionPendidikanRepository.findAllByOrderById();
  }

  public OptionPendidikan findPendidikanById(Long idPendidikan) {
    OptionPendidikan pendidikan = optionPendidikanRepository.findOptionPendidikanById(idPendidikan);
    if (pendidikan == null) {
      throw new ApiRequestException("Id Pendidikan '" + idPendidikan + "' tidak ada");
    }
    return pendidikan;
  }

  public Iterable<OptionStatusKepemilikanRumah> findAllStatusKepemilikanRumah() {
    return optionStatusKepemilikanRumahRepository.findAllByOrderById();
  }

  public OptionStatusKepemilikanRumah findStatusKepemilikanRumahById(Long idStatusKepemilikanRumah) {
    OptionStatusKepemilikanRumah statusKepemilikanRumah = optionStatusKepemilikanRumahRepository.findOptionStatusKepemilikanRumahById(idStatusKepemilikanRumah);
    if (statusKepemilikanRumah == null) {
      throw new ApiRequestException("Id Status Kepemilikan Rumah '" + idStatusKepemilikanRumah + "' tidak ada");
    }
    return statusKepemilikanRumah;
  }

  public Iterable<OptionStatusPekerjaan> findAllStatusPekerjaan() {
    return optionStatusPekerjaanRepository.findAllByOrderById();
  }

  public OptionStatusPekerjaan findStatusPekerjaanById(Long idStatusPekerjaan) {
    OptionStatusPekerjaan statusPekerjaan = optionStatusPekerjaanRepository.findOptionStatusPekerjaanById(idStatusPekerjaan);
    if (statusPekerjaan == null) {
      throw new ApiRequestException("Id Status Pekerjaan '" + idStatusPekerjaan + "' tidak ada");
    }
    return statusPekerjaan;
  }

  public Iterable<OptionStatusPernikahan> findAllStatusPernikahan() {
    return optionStatusPernikahanRepository.findAllByOrderById();
  }

  public OptionStatusPernikahan findStatusPernikahanById(Long idStatusPernikahan) {
    OptionStatusPernikahan statusPernikahan = optionStatusPernikahanRepository.findOptionStatusPernikahanById(idStatusPernikahan);
    if (statusPernikahan == null) {
      throw new ApiRequestException("Id Status Pernikahan '" + idStatusPernikahan + "' tidak ada");
    }
    return statusPernikahan;
  }
}
