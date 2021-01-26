package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterKelurahan;
import id.dasawisma.kelompokapi.model.MasterRw;
import id.dasawisma.kelompokapi.service.MasterKelurahanService;
import id.dasawisma.kelompokapi.service.MasterRwService;
import id.dasawisma.kelompokapi.service.ValidationErrorService;
import id.dasawisma.kelompokapi.specification.MasterRwSpecification;
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
@RequestMapping("/api/rw")
public class MasterRwController {
  private final ValidationErrorService validationErrorService;
  private final MasterRwService rwService;
  private final MasterKelurahanService kelurahanService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllRwPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "kodeRw") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterKelurahan
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterRw filteredRw = new MasterRw();
      filteredRw.setNamaKetuaRw(filter);
      filteredRw.setNoHpRw(filter);
      filteredRw.setNoTelpRw(filter);
      filteredRw.setNoTelpRwAlt(filter);
      if (filterKelurahan != null) {
        MasterKelurahan filterMasterKelurahan = new MasterKelurahan();
        filterMasterKelurahan.setKodeKelurahan(filterKelurahan);
        filteredRw.setKelurahan(filterMasterKelurahan);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(rwService.findAll(
          new MasterRwSpecification(filteredRw), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{kodeRw}")
  public ResponseEntity<?> getRwByKode(@PathVariable String kodeRw) {
    MasterRw masterRw = rwService.findByKode(kodeRw);
    return new ResponseEntity<>(masterRw, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateRw(@Valid @RequestBody MasterRw rw, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterKelurahan kelurahan = kelurahanService.findByKode(rw.getKelurahan().getKodeKelurahan());
    rw.setKelurahan(kelurahan);
    MasterRw masterRwSave = rwService.saveOrUpdate(rw);
    return new ResponseEntity<>(masterRwSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{kodeRw}")
  public ResponseEntity<?> deleteRw(@PathVariable String kodeRw) {
    try {
      rwService.deleteByKode(kodeRw);
      return new ResponseEntity<>("Rw dengan Kode: '" + kodeRw + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kelurahan")
  public ResponseEntity<?> getOptionsKelurahan() {
    Iterable<MasterKelurahan> masterKelurahan;
    if (PrincipalUtil.isPusdatin()) {
      masterKelurahan = kelurahanService.findAllByOrderByNamaKelurahanAsc();
    } else {
      masterKelurahan = kelurahanService.findAllByKodeKelurahanStartingWith(PrincipalUtil.getKodeWilayah());
    }
    List<Map<String, Object>> response = new ArrayList<>();
    masterKelurahan.forEach(kelurahan -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", kelurahan.getKodeKelurahan());
      map.put("value", kelurahan.getKodeKelurahan());
      map.put("text", kelurahan.getNamaKelurahan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}