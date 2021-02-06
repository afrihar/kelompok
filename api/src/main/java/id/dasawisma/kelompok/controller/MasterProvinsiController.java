package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.MasterProvinsi;
import id.dasawisma.kelompok.service.MasterProvinsiService;
import id.dasawisma.kelompok.service.ValidationErrorService;
import id.dasawisma.kelompok.specification.MasterProvinsiSpecification;
import id.dasawisma.kelompok.util.PageableUtil;
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

import static id.dasawisma.kelompok.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/provinsi")
public class MasterProvinsiController {
  private final MasterProvinsiService provinsiService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllProvinsiPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "kodeProvinsi") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterProvinsi filteredProvinsi = new MasterProvinsi();
      filteredProvinsi.setNamaProvinsi(filter);
      return new ResponseEntity<>(PageableUtil.buildPageable(provinsiService.findAll(
          new MasterProvinsiSpecification(filteredProvinsi), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{kodeProvinsi}")
  public ResponseEntity<?> getProvinsiByKode(@PathVariable String kodeProvinsi) {
    MasterProvinsi masterProvinsi = provinsiService.findByKode(kodeProvinsi);
    return new ResponseEntity<>(masterProvinsi, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kode-capil/{kodeProvinsiCapil}")
  public ResponseEntity<?> getProvinsiByKodeCapil(@PathVariable String kodeProvinsiCapil) {
    MasterProvinsi masterProvinsi = provinsiService.findByKodeCapil(kodeProvinsiCapil);
    return new ResponseEntity<>(masterProvinsi, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateProvinsi(@Valid @RequestBody MasterProvinsi provinsi, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterProvinsi masterProvinsiSave = provinsiService.saveOrUpdate(provinsi);
    return new ResponseEntity<>(masterProvinsiSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{kodeProvinsi}")
  public ResponseEntity<?> deleteProvinsi(@PathVariable String kodeProvinsi) {
    try {
      provinsiService.deleteByKode(kodeProvinsi);
      return new ResponseEntity<>("Provinsi dengan Kode: '" + kodeProvinsi + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }
}