package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterKota;
import id.dasawisma.kelompokapi.model.MasterProvinsi;
import id.dasawisma.kelompokapi.service.MasterKotaService;
import id.dasawisma.kelompokapi.service.MasterProvinsiService;
import id.dasawisma.kelompokapi.service.ValidationErrorService;
import id.dasawisma.kelompokapi.specification.MasterKotaSpecification;
import id.dasawisma.kelompokapi.util.PageableUtil;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
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

import static id.dasawisma.kelompokapi.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/kota")
public class MasterKotaController {
  private final MasterKotaService kotaService;
  private final MasterProvinsiService provinsiService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllKotaPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "kodeKota") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterProvinsi
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterKota filteredKota = new MasterKota();
      filteredKota.setNamaKota(filter);
      if (filterProvinsi != null) {
        MasterProvinsi filterMasterProvinsi = new MasterProvinsi();
        filterMasterProvinsi.setKodeProvinsi(filterProvinsi);
        filteredKota.setProvinsi(filterMasterProvinsi);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(kotaService.findAll(
          new MasterKotaSpecification(filteredKota), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{kodeKota}")
  public ResponseEntity<?> getKotaByKode(@PathVariable String kodeKota) {
    MasterKota masterKota = kotaService.findByKode(kodeKota);
    return new ResponseEntity<>(masterKota, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kode-capil/{kodeKotaCapil}")
  public ResponseEntity<?> getKotaByKodeCapil(@PathVariable String kodeKotaCapil) {
    MasterKota masterKota = kotaService.findByKodeCapil(kodeKotaCapil);
    return new ResponseEntity<>(masterKota, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateKota(@Valid @RequestBody MasterKota kota, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterProvinsi provinsi = provinsiService.findByKode(kota.getProvinsi().getKodeProvinsi());
    kota.setProvinsi(provinsi);
    MasterKota masterKotaSave = kotaService.saveOrUpdate(kota);
    return new ResponseEntity<>(masterKotaSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{kodeKota}")
  public ResponseEntity<?> deleteKota(@PathVariable String kodeKota) {
    try {
      kotaService.deleteByKode(kodeKota);
      return new ResponseEntity<>("Kota dengan Kode: '" + kodeKota + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-provinsi")
  public ResponseEntity<?> getOptionsProvinsi() {
    Iterable<MasterProvinsi> masterProvinsi = new ArrayList<>();
    if (PrincipalUtil.isPusdatin()) {
      masterProvinsi = provinsiService.findAllByOrderByNamaProvinsiAsc();
    } else if (PrincipalUtil.isProvinsi()) {
      masterProvinsi = provinsiService.findProvinsiByKodeProvinsi(PrincipalUtil.getKodeWilayah());
    }
    List<Map<String, Object>> response = new ArrayList<>();
    masterProvinsi.forEach(provinsi -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", provinsi.getKodeProvinsi());
      map.put("value", provinsi.getKodeProvinsi());
      map.put("text", provinsi.getNamaProvinsi());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}