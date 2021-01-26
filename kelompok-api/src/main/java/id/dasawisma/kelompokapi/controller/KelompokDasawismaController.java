package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.KelompokDasawisma;
import id.dasawisma.kelompokapi.model.KetuaDasawisma;
import id.dasawisma.kelompokapi.model.MasterRt;
import id.dasawisma.kelompokapi.service.KelompokDasawismaService;
import id.dasawisma.kelompokapi.service.KetuaDasawismaService;
import id.dasawisma.kelompokapi.service.MasterRtService;
import id.dasawisma.kelompokapi.service.ValidationErrorService;
import id.dasawisma.kelompokapi.specification.KelompokDasawismaSpecification;
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
@RequestMapping("/api/kelompok")
public class KelompokDasawismaController {
  private final ValidationErrorService validationErrorService;
  private final KelompokDasawismaService kelompokDasawismaService;
  private final MasterRtService rtService;
  private final KetuaDasawismaService ketuaDasawismaService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllKelompokPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterWilayah
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      KelompokDasawisma filterKelompokDasawisma = new KelompokDasawisma();
      if (filter != null) {
        filterKelompokDasawisma.setNamaKelompok(filter);
      }
      if (filterWilayah != null) {
        MasterRt filterMasterRt = new MasterRt();
        filterMasterRt.setKodeRt(filterWilayah);
        filterKelompokDasawisma.setRt(filterMasterRt);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(kelompokDasawismaService.findAll(
          new KelompokDasawismaSpecification(filterKelompokDasawisma), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{idKelompok}")
  public ResponseEntity<?> getKelompokById(@PathVariable long idKelompok) {
    KelompokDasawisma ketuaDasawisma = kelompokDasawismaService.findById(idKelompok);
    return new ResponseEntity<>(ketuaDasawisma, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/noKader/{noKaderKelompok}")
  public ResponseEntity<?> getKelompokById(@PathVariable String noKaderKelompok) {
    KelompokDasawisma ketuaDasawisma = kelompokDasawismaService.findByNoKader(noKaderKelompok);
    return new ResponseEntity<>(ketuaDasawisma, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateKelompok(@Valid @RequestBody KelompokDasawisma kelompokDasawisma, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    KetuaDasawisma ketuaDasawisma = ketuaDasawismaService.findByNoKader(kelompokDasawisma.getKetuaDasawisma().getNoKader());
    kelompokDasawisma.setKetuaDasawisma(ketuaDasawisma);
    MasterRt rt = rtService.findByKode(kelompokDasawisma.getRt().getKodeRt());
    kelompokDasawisma.setRt(rt);
    KelompokDasawisma KelompokSave = kelompokDasawismaService.saveOrUpdate(kelompokDasawisma);
    return new ResponseEntity<>(KelompokSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{idKelompok}")
  public ResponseEntity<?> deleteKelompok(@PathVariable long idKelompok) {
    try {
      kelompokDasawismaService.deleteById(idKelompok);
      return new ResponseEntity<>("Kelompok dengan ID: '" + idKelompok + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }
}