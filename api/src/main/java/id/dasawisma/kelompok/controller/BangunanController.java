package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.Bangunan;
import id.dasawisma.kelompok.model.KelompokDasawisma;
import id.dasawisma.kelompok.service.BangunanService;
import id.dasawisma.kelompok.service.KelompokDasawismaService;
import id.dasawisma.kelompok.service.ValidationErrorService;
import id.dasawisma.kelompok.specification.BangunanSpecification;
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
@RequestMapping("/api/bangunan")
public class BangunanController {
  private final ValidationErrorService validationErrorService;
  private final BangunanService bangunanService;
  private final KelompokDasawismaService kelompokService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateBangunan(@Valid @RequestBody Bangunan bangunan, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    if (bangunan.getKelompokBangunan() != null && bangunan.getKelompokBangunan().getId() > 0) {
      KelompokDasawisma kelompok = kelompokService.findById(bangunan.getKelompokBangunan().getId());
      bangunan.setKelompokBangunan(kelompok);
      bangunan.setNoUrut(bangunanService.getLastNoUrutByIdKelompok(kelompok.getId()) + 1);
    }
    if (bangunan.getNoUrut() <= 20) {
      Bangunan bangunanSave = bangunanService.saveOrUpdate(bangunan);
      return new ResponseEntity<>(bangunanSave, HttpStatus.CREATED);
    } else {
      return new ResponseEntity<>("Jumlah bangunan tidak boleh lebih dari 20", HttpStatus.BAD_REQUEST);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{idBangunan}")
  public ResponseEntity<?> deleteBangunan(@PathVariable Long idBangunan) {
    try {
      bangunanService.deleteById(idBangunan);
      return new ResponseEntity<>("Bangunan dengan Id: '" + idBangunan + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllBangunanPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) Long filterWilayah
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      Bangunan filterBangunan = new Bangunan();
      if (filter != null) {
        filterBangunan.setIdentifikasi(filter);
      }
      if (filterWilayah != null) {
        KelompokDasawisma filterKelompok = new KelompokDasawisma();
        filterKelompok.setId(filterWilayah);
        filterBangunan.setKelompokBangunan(filterKelompok);
//        MasterRt filterMasterRt = new MasterRt();
//        filterMasterRt.setKodeRt(filterWilayah);
//        filterBangunan.getKelompokBangunan().setRtKelompok(filterMasterRt);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(bangunanService.findAll(
          new BangunanSpecification(filterBangunan), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{idBangunan}")
  public ResponseEntity<?> getBangunanById(@PathVariable Long idBangunan) {
    Bangunan bangunan = bangunanService.findById(idBangunan);
    return new ResponseEntity<>(bangunan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kelompok/{idKelompok}")
  public ResponseEntity<?> getBangunanByIdKelompok(@PathVariable Long idKelompok) {
    Iterable<Bangunan> bangunanList = bangunanService.findAllByKelompokBangunan_IdOrderByNoUrut(idKelompok);
    return new ResponseEntity<>(bangunanList, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kelompok")
  public ResponseEntity<?> getKelompokOptionsRt() {
    Iterable<KelompokDasawisma> kelompok = null;
    if (PrincipalUtil.isPusdatin()) {
      kelompok = kelompokService.findAllByOrderByNamaKelompok();
    } else if (PrincipalUtil.isKelurahan())
      kelompok = kelompokService.findAllByRtKelompok_Rw_Kelurahan_KodeKelurahanOrderByNamaKelompok(PrincipalUtil.getKodeWilayah());
//    else if (PrincipalUtil.isKader()) kelompok = kelompokService.findAllByPetugasKelompok_NikOrderByNamaKelompok();
    List<Map<String, Object>> response = new ArrayList<>();
    if (kelompok != null) {
      kelompok.forEach(k -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", k.getId());
        map.put("value", k.getId());
        map.put("text", k.getNamaKelompok());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}