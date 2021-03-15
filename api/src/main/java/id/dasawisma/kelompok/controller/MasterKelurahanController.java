package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterKecamatan;
import id.dasawisma.kelompok.model.MasterKelurahan;
import id.dasawisma.kelompok.service.MasterKecamatanService;
import id.dasawisma.kelompok.service.MasterKelurahanService;
import id.dasawisma.kelompok.service.ValidationErrorService;
import id.dasawisma.kelompok.specification.MasterKelurahanSpecification;
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
@RequestMapping("/api/kelurahan")
public class MasterKelurahanController {
  private final MasterKelurahanService kelurahanService;
  private final MasterKecamatanService kecamatanService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllKelurahanPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "kodeKelurahan") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterKecamatan
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterKelurahan filteredKelurahan = new MasterKelurahan();
      filteredKelurahan.setNamaKelurahan(filter);
      filteredKelurahan.setNamaKelompokKelurahan(filter);
      if (filterKecamatan != null) {
        MasterKecamatan filterMasterKecamatan = new MasterKecamatan();
        filterMasterKecamatan.setKodeKecamatan(filterKecamatan);
        filteredKelurahan.setKecamatan(filterMasterKecamatan);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(kelurahanService.findAll(
          new MasterKelurahanSpecification(filteredKelurahan), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{kodeKelurahan}")
  public ResponseEntity<?> getKelurahanByKode(@PathVariable String kodeKelurahan) {
    MasterKelurahan masterKelurahan = kelurahanService.findByKode(kodeKelurahan);
    return new ResponseEntity<>(masterKelurahan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kode-capil/{kodeKelurahanCapil}")
  public ResponseEntity<?> getKelurahanByKodeCapil(@PathVariable String kodeKelurahanCapil) {
    MasterKelurahan masterKelurahan = kelurahanService.findByKodeCapil(kodeKelurahanCapil);
    return new ResponseEntity<>(masterKelurahan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateKelurahan(@Valid @RequestBody MasterKelurahan kelurahan, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterKecamatan kecamatan = kecamatanService.findByKode(kelurahan.getKecamatan().getKodeKecamatan());
    kelurahan.setKecamatan(kecamatan);
    MasterKelurahan masterKelurahanSave = kelurahanService.saveOrUpdate(kelurahan);
    return new ResponseEntity<>(masterKelurahanSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{kodeKelurahan}")
  public ResponseEntity<?> deleteKelurahan(@PathVariable String kodeKelurahan) {
    try {
      kelurahanService.deleteByKode(kodeKelurahan);
      return new ResponseEntity<>("Kelurahan dengan Kode: '" + kodeKelurahan + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kecamatan")
  public ResponseEntity<?> getOptionsKecamatan() {
    Iterable<MasterKecamatan> masterKecamatan = null;
    if (PrincipalUtil.isPusdatin())
      masterKecamatan = kecamatanService.findAllByOrderByNamaKecamatanAsc();
    else if (PrincipalUtil.isProvinsi())
      masterKecamatan = kecamatanService.findAllByKota_KodeKotaStartingWithOrderByNamaKecamatanAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKota())
      masterKecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKecamatan())
      masterKecamatan = kecamatanService.findAllByKodeKecamatan(PrincipalUtil.getKodeWilayah());
    List<Map<String, Object>> response = new ArrayList<>();
    if (masterKecamatan != null) {
      masterKecamatan.forEach(kecamatan -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kecamatan.getKodeKecamatan());
        map.put("value", kecamatan.getKodeKecamatan());
        map.put("text", kecamatan.getNamaKecamatan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}