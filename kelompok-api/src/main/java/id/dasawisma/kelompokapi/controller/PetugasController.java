package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterKota;
import id.dasawisma.kelompokapi.model.MasterProvinsi;
import id.dasawisma.kelompokapi.model.MasterRt;
import id.dasawisma.kelompokapi.model.Petugas;
import id.dasawisma.kelompokapi.service.*;
import id.dasawisma.kelompokapi.specification.PetugasSpecification;
import id.dasawisma.kelompokapi.util.PageableUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

import static id.dasawisma.kelompokapi.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/petugas")
public class PetugasController {
  private final PetugasService petugasService;
  private final MasterProvinsiService provinsiService;
  private final MasterKotaService kotaService;
  private final MasterRtService rtService;
  private final ValidationErrorService validationErrorService;

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
      }
      if (filterWilayah != null) {
        MasterRt filterMasterRt = new MasterRt();
        filterMasterRt.setKodeRt(filterWilayah);
        filterPetugas.setRtDomisili(filterMasterRt);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(petugasService.findAll(
          new PetugasSpecification(filterPetugas), paging)
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
  @PostMapping
  public ResponseEntity<?> saveOrUpdatePetugas(@Valid @RequestBody Petugas petugas, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterRt rt = rtService.findByKode(petugas.getRtDomisili().getKodeRt());
    petugas.setRtDomisili(rt);
    MasterProvinsi provinsi = provinsiService.findByKode(petugas.getProvinsiEmergencyCall().getKodeProvinsi());
    petugas.setProvinsiEmergencyCall(provinsi);
    MasterKota kota = kotaService.findByKode(petugas.getKotaEmergencyCall().getKodeKota());
    petugas.setKotaEmergencyCall(kota);
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
}