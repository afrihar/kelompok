package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterKecamatan;
import id.dasawisma.kelompok.model.MasterKota;
import id.dasawisma.kelompok.service.MasterKecamatanService;
import id.dasawisma.kelompok.service.MasterKotaService;
import id.dasawisma.kelompok.service.ValidationErrorService;
import id.dasawisma.kelompok.specification.MasterKecamatanSpecification;
import id.dasawisma.kelompok.util.PageableUtil;
import id.dasawisma.kelompok.util.PrincipalUtil;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static id.dasawisma.kelompok.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/kecamatan")
public class MasterKecamatanController {
  private final MasterKecamatanService kecamatanService;
  private final MasterKotaService kotaService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllKecamatanPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "kodeKecamatan") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterKota
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterKecamatan filteredKecamatan = new MasterKecamatan();
      filteredKecamatan.setNamaKecamatan(filter);
      if (filterKota != null) {
        MasterKota filterMasterKota = new MasterKota();
        filterMasterKota.setKodeKota(filterKota);
        filteredKecamatan.setKota(filterMasterKota);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(kecamatanService.findAll(
          new MasterKecamatanSpecification(filteredKecamatan), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{kodeKecamatan}")
  public ResponseEntity<?> getKecamatanByKode(@PathVariable String kodeKecamatan) {
    MasterKecamatan masterKecamatan = kecamatanService.findByKode(kodeKecamatan);
    return new ResponseEntity<>(masterKecamatan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kode-capil/{kodeKecamatanCapil}")
  public ResponseEntity<?> getKecamatanByKodeCapil(@PathVariable String kodeKecamatanCapil) {
    MasterKecamatan masterKecamatan = kecamatanService.findByKodeCapil(kodeKecamatanCapil);
    return new ResponseEntity<>(masterKecamatan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateKecamatan(@Valid @RequestBody MasterKecamatan kecamatan, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterKota kota = kotaService.findByKode(kecamatan.getKota().getKodeKota());
    kecamatan.setKota(kota);
    MasterKecamatan masterKecamatanSave = kecamatanService.saveOrUpdate(kecamatan);
    return new ResponseEntity<>(masterKecamatanSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{kodeKecamatan}")
  public ResponseEntity<?> deleteKecamatan(@PathVariable String kodeKecamatan) {
    try {
      kecamatanService.deleteByKode(kodeKecamatan);
      return new ResponseEntity<>("Kecamatan dengan Kode: '" + kodeKecamatan + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kota")
  public ResponseEntity<?> getOptionsKota() {
    Iterable<MasterKota> masterKota;
    if (PrincipalUtil.isPusdatin()) {
      masterKota = kotaService.findAllByOrderByNamaKotaAsc();
    } else {
      masterKota = kotaService.findAllByKodeKotaStartingWith(PrincipalUtil.getKodeWilayah());
    }
    List<Map<String, Object>> response = new ArrayList<>();
    masterKota.forEach(kota -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", kota.getKodeKota());
      map.put("value", kota.getKodeKota());
      map.put("text", kota.getNamaKota());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

}
