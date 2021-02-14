package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.*;
import id.dasawisma.kelompok.service.*;
import id.dasawisma.kelompok.specification.PetugasByDomisiliSpecification;
import id.dasawisma.kelompok.specification.PetugasSpecification;
import id.dasawisma.kelompok.util.PageableUtil;
import id.dasawisma.kelompok.util.PrincipalUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.util.*;

import static id.dasawisma.kelompok.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/petugas")
public class PetugasController {
  private final ValidationErrorService validationErrorService;
  private final PetugasService petugasService;
  private final OptionsService optionsService;
  private final MasterProvinsiService provinsiService;
  private final MasterKotaService kotaService;
  private final MasterKecamatanService kecamatanService;
  private final MasterKelurahanService kelurahanService;
  private final MasterRwService rwService;
  private final MasterRtService rtService;
  private final KelompokDasawismaService kelompokService;
  @Value("${kelompok.soa-auth-user}")
  private String authUser;
  @Value("${kelompok.soa-auth-pass}")
  private String authPass;
  @Value("${kelompok.soa-app}")
  private String app;
  @Value("${kelompok.soa-pget}")
  private String pget;
  @Value("${kelompok.soa-pusr}")
  private String pusr;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping("/kelompok")
  public ResponseEntity<?> saveOrUpdatePetugasKelompok(@Valid @RequestBody PetugasKelompok petugasKelompok, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    Iterable<KelompokDasawisma> oldKelompok = kelompokService.findAllByPetugasKelompok_NikOrderByNamaKelompok(petugasKelompok.nik);
    oldKelompok.forEach(ok->{
      KelompokDasawisma oldKelompokDasawisma = kelompokService.findById(ok.getId());
      oldKelompokDasawisma.setRtKelompok(rtService.findByKode(petugasKelompok.rtKelompok));
      oldKelompokDasawisma.setPetugasKelompok(null);
      kelompokService.saveOrUpdate(oldKelompokDasawisma);
    });
    List<Object> response = new ArrayList<>();
    petugasKelompok.getIdKelompok().forEach(kel -> {
          KelompokDasawisma kelompokDasawisma = kelompokService.findById(kel);
          kelompokDasawisma.setRtKelompok(rtService.findByKode(petugasKelompok.rtKelompok));
          kelompokDasawisma.setPetugasKelompok(petugasService.findByNik(petugasKelompok.nik));
          KelompokDasawisma petugasKelompokSave = kelompokService.saveOrUpdate(kelompokDasawisma);
          response.add(petugasKelompokSave);
        }
    );
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdatePetugas(@Valid @RequestBody Petugas petugas, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    if (petugas.getAgama() != null && petugas.getAgama().getId() > 0) {
      OptionAgama agama = optionsService.findAgamaById(petugas.getAgama().getId());
      petugas.setAgama(agama);
    } else {
      petugas.setAgama(null);
    }
    if (petugas.getPendidikan() != null && petugas.getPendidikan().getId() > 0) {
      OptionPendidikan pendidikan = optionsService.findPendidikanById(petugas.getPendidikan().getId());
      petugas.setPendidikan(pendidikan);
    } else {
      petugas.setPendidikan(null);
    }
    if (petugas.getPekerjaan() != null && petugas.getPekerjaan().getId() > 0) {
      OptionPekerjaan pekerjaan = optionsService.findPekerjaanById(petugas.getPekerjaan().getId());
      petugas.setPekerjaan(pekerjaan);
    } else {
      petugas.setPekerjaan(null);
    }
    if (petugas.getStatusPekerjaan() != null && petugas.getStatusPekerjaan().getId() > 0) {
      OptionStatusPekerjaan statusPekerjaan = optionsService.findStatusPekerjaanById(petugas.getStatusPekerjaan().getId());
      petugas.setStatusPekerjaan(statusPekerjaan);
    } else {
      petugas.setStatusPekerjaan(null);
    }
    if (petugas.getStatusPernikahan() != null && petugas.getStatusPernikahan().getId() > 0) {
      OptionStatusPernikahan statusPernikahan = optionsService.findStatusPernikahanById(petugas.getStatusPernikahan().getId());
      petugas.setStatusPernikahan(statusPernikahan);
    } else {
      petugas.setStatusPernikahan(null);
    }
    if (petugas.getHubunganEmergency() != null && petugas.getHubunganEmergency().getId() > 0) {
      OptionHubunganEmergency hubunganEmergency = optionsService.findHubunganEmergencyById(petugas.getHubunganEmergency().getId());
      petugas.setHubunganEmergency(hubunganEmergency);
    } else {
      petugas.setHubunganEmergency(null);
    }
    if (petugas.getRtDomisili() != null && !petugas.getRtDomisili().getKodeRt().isBlank()) {
      MasterRt rt = rtService.findByKode(petugas.getRtDomisili().getKodeRt());
      petugas.setRtDomisili(rt);
    } else {
      petugas.setRtDomisili(null);
    }
    if (petugas.getRtTugas() != null && !petugas.getRtTugas().getKodeRt().isBlank()) {
      MasterRt rt = rtService.findByKode(petugas.getRtTugas().getKodeRt());
      petugas.setRtTugas(rt);
    } else {
      petugas.setRtTugas(null);
    }
    if (petugas.getProvinsiEmergencyCall() != null && !petugas.getProvinsiEmergencyCall().getKodeProvinsi().isBlank()) {
      MasterProvinsi provinsi = provinsiService.findByKode(petugas.getProvinsiEmergencyCall().getKodeProvinsi());
      petugas.setProvinsiEmergencyCall(provinsi);
    } else {
      petugas.setProvinsiEmergencyCall(null);
    }
    if (petugas.getKotaEmergencyCall() != null && !petugas.getKotaEmergencyCall().getKodeKota().isBlank()) {
      MasterKota kota = kotaService.findByKode(petugas.getKotaEmergencyCall().getKodeKota());
      petugas.setKotaEmergencyCall(kota);
    } else {
      petugas.setKotaEmergencyCall(null);
    }
    if (petugas.getEmail().equals("")) petugas.setEmail(null);
    if (petugas.getNoRekening().equals("")) petugas.setNoRekening(null);
    Petugas PetugasSave = petugasService.saveOrUpdate(petugas);
    return new ResponseEntity<>(PetugasSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{nikPetugas}")
  public ResponseEntity<?> deletePetugas(@PathVariable String nikPetugas) {
    try {
      petugasService.deleteByNik(nikPetugas);
      return new ResponseEntity<>("Petugas dengan NIK: '" + nikPetugas + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllPetugasPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "nik") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterWilayah
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      Petugas filterPetugas = new Petugas();
      if (filter != null) {
        filterPetugas.setNik(filter);
        filterPetugas.setNama(filter);
        filterPetugas.setNoHpPetugas(filter);
        filterPetugas.setNoTelpPetugas(filter);
        filterPetugas.setEmail(filter);
        filterPetugas.setNoRekening(filter);
        filterPetugas.setNoNpwp(filter);
      }
      if (filterWilayah != null) {
        MasterRt filterMasterRt = new MasterRt();
        filterMasterRt.setKodeRt(filterWilayah);
        filterPetugas.setRtTugas(filterMasterRt);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(petugasService.findAll(
          new PetugasSpecification(filterPetugas), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/domisili")
  public ResponseEntity<Map<String, Object>> getAllPetugasDomisiliPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "rtTugas_KodeRt") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterWilayah
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      Petugas filterPetugas = new Petugas();
      if (filter != null) {
        filterPetugas.setNik(filter);
        filterPetugas.setNama(filter);
        filterPetugas.setNoHpPetugas(filter);
        filterPetugas.setNoTelpPetugas(filter);
        filterPetugas.setEmail(filter);
        filterPetugas.setNoRekening(filter);
        filterPetugas.setNoNpwp(filter);
      }
      if (filterWilayah != null) {
        MasterRt filterMasterRt = new MasterRt();
        filterMasterRt.setKodeRt(filterWilayah);
        filterPetugas.setRtTugas(filterMasterRt);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(petugasService.findAll(
          new PetugasByDomisiliSpecification(filterPetugas), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{nikPetugas}")
  public ResponseEntity<?> getPetugasByNik(@PathVariable String nikPetugas) {
    Petugas petugas = petugasService.findByNik(nikPetugas);
    return new ResponseEntity<>(petugas, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/email/{emailPetugas}")
  public ResponseEntity<?> getPetugasByEmail(@PathVariable String emailPetugas) {
    Petugas petugas = petugasService.findByEmail(emailPetugas);
    return new ResponseEntity<>(petugas, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/rekening/{noRekeningPetugas}")
  public ResponseEntity<?> getPetugasByNoRekening(@PathVariable String noRekeningPetugas) {
    Petugas petugas = petugasService.findByNoRekening(noRekeningPetugas);
    return new ResponseEntity<>(petugas, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kota-domisili")
  public ResponseEntity<?> getPetugasOptionsKotaDomisili() {
    Iterable<MasterKota> kota = null;
    if (PrincipalUtil.isPusdatin())
      kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc("31");
    else if (PrincipalUtil.isProvinsi())
      kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(PrincipalUtil.getKodeProvinsi());
    else if (PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kota = kotaService.findAllByKodeKota(PrincipalUtil.getKodeKota());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kota != null) {
      kota.forEach(k -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", k.getKodeKota());
        map.put("value", k.getKodeKota());
        map.put("text", k.getNamaKota());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kecamatan-domisili/{kodeKota}")
  public ResponseEntity<?> getPetugasOptionsKecamatanDomisili(@PathVariable String kodeKota) {
    Iterable<MasterKecamatan> kecamatan = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi())
      kecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(kodeKota);
    else if (PrincipalUtil.isKota())
      kecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kecamatan = kecamatanService.findAllByKodeKecamatan(PrincipalUtil.getKodeKecamatan());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kecamatan != null) {
      kecamatan.forEach(kec -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kec.getKodeKecamatan());
        map.put("value", kec.getKodeKecamatan());
        map.put("text", kec.getNamaKecamatan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kelurahan-domisili/{kodeKecamatan}")
  public ResponseEntity<?> getPetugasOptionsKelurahanDomisili(@PathVariable String kodeKecamatan) {
    Iterable<MasterKelurahan> kelurahan = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota())
      kelurahan = kelurahanService.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(kodeKecamatan);
    else if (PrincipalUtil.isKecamatan())
      kelurahan = kelurahanService.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kelurahan = kelurahanService.findAllByKodeKelurahan(PrincipalUtil.getKodeKelurahan());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kelurahan != null) {
      kelurahan.forEach(kel -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kel.getKodeKelurahan());
        map.put("value", kel.getKodeKelurahan());
        map.put("text", kel.getNamaKelurahan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rw-domisili/{kodeKelurahan}")
  public ResponseEntity<?> getPetugasOptionsRwDomisili(@PathVariable String kodeKelurahan) {
    Iterable<MasterRw> rw = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan())
      rw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(kodeKelurahan);
    else if (PrincipalUtil.isKelurahan())
      rw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRw() || PrincipalUtil.isRt())
      rw = rwService.findAllByKodeRw(PrincipalUtil.getKodeRw());
    List<Map<String, Object>> response = new ArrayList<>();
    if (rw != null) {
      rw.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getKodeRw());
        map.put("value", r.getKodeRw());
        map.put("text", "RW " + r.getLabelRw());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rt-domisili/{kodeRw}")
  public ResponseEntity<?> getPetugasOptionsRtDomisili(@PathVariable String kodeRw) {
    Iterable<MasterRt> rt = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan())
      rt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(kodeRw);
    else if (PrincipalUtil.isRw())
      rt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRt())
      rt = rtService.findAllByKodeRt(PrincipalUtil.getKodeRt());
    List<Map<String, Object>> response = new ArrayList<>();
    if (rt != null) {
      rt.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getKodeRt());
        map.put("value", r.getKodeRt());
        map.put("text", "RT " + r.getLabelRt());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kota-tugas")
  public ResponseEntity<?> getPetugasOptionsKotaTugas() {
    Iterable<MasterKota> kota = null;
    if (PrincipalUtil.isPusdatin())
      kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc("31");
    else if (PrincipalUtil.isProvinsi())
      kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(PrincipalUtil.getKodeProvinsi());
    else if (PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kota = kotaService.findAllByKodeKota(PrincipalUtil.getKodeKota());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kota != null) {
      kota.forEach(k -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", k.getKodeKota());
        map.put("value", k.getKodeKota());
        map.put("text", k.getNamaKota());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kecamatan-tugas/{kodeKota}")
  public ResponseEntity<?> getPetugasOptionsKecamatanTugas(@PathVariable String kodeKota) {
    Iterable<MasterKecamatan> kecamatan = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi())
      kecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(kodeKota);
    else if (PrincipalUtil.isKota())
      kecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kecamatan = kecamatanService.findAllByKodeKecamatan(PrincipalUtil.getKodeKecamatan());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kecamatan != null) {
      kecamatan.forEach(kec -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kec.getKodeKecamatan());
        map.put("value", kec.getKodeKecamatan());
        map.put("text", kec.getNamaKecamatan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kelurahan-tugas/{kodeKecamatan}")
  public ResponseEntity<?> getPetugasOptionsKelurahanTugas(@PathVariable String kodeKecamatan) {
    Iterable<MasterKelurahan> kelurahan = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota())
      kelurahan = kelurahanService.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(kodeKecamatan);
    else if (PrincipalUtil.isKecamatan())
      kelurahan = kelurahanService.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kelurahan = kelurahanService.findAllByKodeKelurahan(PrincipalUtil.getKodeKelurahan());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kelurahan != null) {
      kelurahan.forEach(kel -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kel.getKodeKelurahan());
        map.put("value", kel.getKodeKelurahan());
        map.put("text", kel.getNamaKelurahan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rw-tugas/{kodeKelurahan}")
  public ResponseEntity<?> getPetugasOptionsRwTugas(@PathVariable String kodeKelurahan) {
    Iterable<MasterRw> rw = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan())
      rw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(kodeKelurahan);
    else if (PrincipalUtil.isKelurahan())
      rw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRw() || PrincipalUtil.isRt())
      rw = rwService.findAllByKodeRw(PrincipalUtil.getKodeRw());
    List<Map<String, Object>> response = new ArrayList<>();
    if (rw != null) {
      rw.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getKodeRw());
        map.put("value", r.getKodeRw());
        map.put("text", "RW " + r.getLabelRw());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rt-tugas/{kodeRw}")
  public ResponseEntity<?> getPetugasOptionsRtTugas(@PathVariable String kodeRw) {
    Iterable<MasterRt> rt = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan())
      rt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(kodeRw);
    else if (PrincipalUtil.isRw())
      rt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRt())
      rt = rtService.findAllByKodeRt(PrincipalUtil.getKodeRt());
    List<Map<String, Object>> response = new ArrayList<>();
    if (rt != null) {
      rt.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getKodeRt());
        map.put("value", r.getKodeRt());
        map.put("text", "RT " + r.getLabelRt());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/nik-dki/{nik}")
  public ResponseEntity<?> getNikDki(@PathVariable String nik) {
    RestTemplate restTemplate = new RestTemplate();
    final String uri = "https://soadki.jakarta.go.id/rest/gov/dki/dukcapil/ws/getNIK";
    UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(uri).queryParam("app", app)
        .queryParam("pget", pget).queryParam("pusr", pusr).queryParam("nik", nik);
    String base64Creds = new String(Base64.encodeBase64((authUser + ":" + authPass).getBytes()));
    HttpHeaders headers = new HttpHeaders();
    headers.set("Accept", MediaType.APPLICATION_JSON_VALUE);
    headers.add("Authorization", "Basic " + base64Creds);
    Map<String, String> response = new HashMap<>();
    try {
      HttpEntity<String> entity = new HttpEntity<>(headers);
      ResponseEntity<SoaNik> responseSoa;
      responseSoa = restTemplate.exchange(builder.build().encode().toUri(), HttpMethod.GET, entity, SoaNik.class);
      if (Objects.requireNonNull(responseSoa.getBody()).getStatus().equals("1")) {
        SoaAnggota anggota = responseSoa.getBody().getSoaDataNik().getAnggota();
        response.put("nama", anggota.getNamaLengkap());
        response.put("alamatDomisili", anggota.getAlamat());
        response.put("gender", (anggota.getJenisKelamin().equals("1") ? "L" : "P"));
        response.put("agama", anggota.getAgama());
        response.put("tempatLahir", anggota.getTempatLahir());
        response.put("tanggalLahir", anggota.getTanggalLahir());
        response.put("statusPernikahan", anggota.getStatusKawin());
        switch (anggota.getPendidikanTerakhir()) {
          case "1":
            response.put("pendidikan", "12");
            break;
          case "2":
            response.put("pendidikan", "11");
            break;
          case "3":
            response.put("pendidikan", "1");
            break;
          case "4":
            response.put("pendidikan", "2");
            break;
          case "5":
            response.put("pendidikan", "3");
            break;
          case "6":
            response.put("pendidikan", "4");
            break;
          case "7":
            response.put("pendidikan", "6");
            break;
          default:
            response.put("pendidikan", anggota.getPendidikanTerakhir());
            break;
        }
        if (anggota.getJenisPekerjaan().equals("89")) response.put("pekerjaan", "99");
        else response.put("pekerjaan", anggota.getJenisPekerjaan());
        String kodeKecamatanCapil;
        if (anggota.getKodeKecamatanCapil().length() == 1) kodeKecamatanCapil = "0" + anggota.getKodeKecamatanCapil();
        else kodeKecamatanCapil = anggota.getKodeKecamatanCapil();
        response.put("kelurahanCapil", anggota.getKodeProvinsiCapil() + anggota.getKodeKotaCapil()
            + kodeKecamatanCapil + anggota.getKodeKelurahanCapil());
        String kodeRwCapil = null;
        if (anggota.getRwCapil().length() == 1) kodeRwCapil = "00" + anggota.getRwCapil();
        else if (anggota.getRwCapil().length() == 2) kodeRwCapil = "0" + anggota.getRwCapil();
        else if (anggota.getRwCapil().length() == 3) kodeRwCapil = anggota.getRwCapil();
        if (kodeRwCapil != null) response.put("rwCapil", kodeRwCapil);
        String kodeRtCapil = null;
        if (anggota.getRtCapil().length() == 1) kodeRtCapil = "00" + anggota.getRtCapil();
        else if (anggota.getRtCapil().length() == 2) kodeRtCapil = "0" + anggota.getRtCapil();
        else if (anggota.getRtCapil().length() == 3) kodeRtCapil = anggota.getRtCapil();
        if (kodeRtCapil != null) response.put("rtCapil", kodeRtCapil);
      } else {
        response.put("notfound", "Nik tidak terdaftar di DKI");
      }
    } catch (Exception e) {
      response.put("error", "Koneksi ke Dukcapil (SOA DKI) bermasalah");
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kode-capil/{kodeKelurahanCapil}")
  public ResponseEntity<?> getKelurahanByKodeCapil(@PathVariable String kodeKelurahanCapil) {
    MasterKelurahan masterKelurahan = kelurahanService.findByKodeCapil(kodeKelurahanCapil);
    return new ResponseEntity<>(masterKelurahan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-provinsi-ec")
  public ResponseEntity<?> getPetugasOptionsProvinsiEc() {
    Iterable<MasterProvinsi> provinsi;
    provinsi = provinsiService.findAllByOrderByNamaProvinsiAsc();
    List<Map<String, Object>> response = new ArrayList<>();
    provinsi.forEach(k -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", k.getKodeProvinsi());
      map.put("value", k.getKodeProvinsi());
      map.put("text", k.getNamaProvinsi());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kota-ec/{kodeProvinsi}")
  public ResponseEntity<?> getPetugasOptionsKotaEc(@PathVariable String kodeProvinsi) {
    Iterable<MasterKota> kota;
    kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(kodeProvinsi);
    List<Map<String, Object>> response = new ArrayList<>();
    kota.forEach(k -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", k.getKodeKota());
      map.put("value", k.getKodeKota());
      map.put("text", k.getNamaKota());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kelompok/{nik}")
  public ResponseEntity<?> getPetugasKelompok(@PathVariable String nik) {
    Iterable<KelompokDasawisma> kelompok;
    kelompok = kelompokService.findAllByPetugasKelompok_NikOrderByNamaKelompok(nik);
    List<Object> response = new ArrayList<>();
    kelompok.forEach(kel -> response.add(kel.getId()));
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}