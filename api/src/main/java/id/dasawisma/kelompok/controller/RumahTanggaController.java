package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.Bangunan;
import id.dasawisma.kelompok.model.MasterRt;
import id.dasawisma.kelompok.model.RumahTangga;
import id.dasawisma.kelompok.service.BangunanService;
import id.dasawisma.kelompok.service.RumahTanggaService;
import id.dasawisma.kelompok.service.ValidationErrorService;
import id.dasawisma.kelompok.specification.RumahTanggaSpecification;
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
@RequestMapping("/api/rumahtangga")
public class RumahTanggaController {
  private final ValidationErrorService validationErrorService;
  private final RumahTanggaService rumahTanggaService;
  private final BangunanService bangunanService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateRumahTangga(@Valid @RequestBody RumahTangga rumahTangga, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    if (rumahTangga.getBangunanRumahTangga() != null && rumahTangga.getBangunanRumahTangga().getId() > 0) {
      Bangunan bangunan = bangunanService.findById(rumahTangga.getBangunanRumahTangga().getId());
      rumahTangga.setBangunanRumahTangga(bangunan);
    }
    RumahTangga rumahTanggaSave = rumahTanggaService.saveOrUpdate(rumahTangga);
    return new ResponseEntity<>(rumahTanggaSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{idRumahTangga}")
  public ResponseEntity<?> deleteRumahTangga(@PathVariable Long idRumahTangga) {
    try {
      rumahTanggaService.deleteById(idRumahTangga);
      return new ResponseEntity<>("RumahTangga dengan Id: '" + idRumahTangga + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllRumahTanggaPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterWilayah
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      RumahTangga filterRumahTangga = new RumahTangga();
//      if (filter != null) {
//        filterRumahTangga.setIdentifikasi(filter);
//      }
//      if (filterWilayah != null) {
//        MasterRt filterMasterRt = new MasterRt();
//        filterMasterRt.setKodeRt(filterWilayah);
//        filterRumahTangga.getBangunanRumahTangga().setRtKelompok(filterMasterRt);
//      }
      return new ResponseEntity<>(PageableUtil.buildPageable(rumahTanggaService.findAll(
          new RumahTanggaSpecification(filterRumahTangga), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{idRumahTangga}")
  public ResponseEntity<?> getRumahTanggaById(@PathVariable Long idRumahTangga) {
    RumahTangga rumahTangga = rumahTanggaService.findById(idRumahTangga);
    return new ResponseEntity<>(rumahTangga, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/bangunan/{idBangunan}")
  public ResponseEntity<?> getRumahTanggaByIdBangunan(@PathVariable Long idBangunan) {
    Iterable<RumahTangga> rumahTanggaList = rumahTanggaService.findAllByBangunanRumahTangga_IdOrderByIdDesc(idBangunan);
    return new ResponseEntity<>(rumahTanggaList, HttpStatus.OK);
  }
}