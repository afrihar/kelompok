package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.MasterProvinsi;
import id.dasawisma.kelompokapi.service.ValidationErrorService;
import id.dasawisma.kelompokapi.service.MasterProvinsiService;
import id.dasawisma.kelompokapi.specification.MasterProvinsiSpecification;
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
@RequestMapping("/api/provinsi")
public class MasterProvinsiController {
  private final MasterProvinsiService masterProvinsiService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/all")
  public Iterable<MasterProvinsi> getAllProvinsi() {
    return masterProvinsiService.findAllByOrderByNamaProvinsiAsc();
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllProvinsiPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterProvinsi filteredProvinsi = new MasterProvinsi();
      filteredProvinsi.setNamaProvinsi(filter);
      return new ResponseEntity<>(PageableUtil.buildPageable(masterProvinsiService.findAll(
          new MasterProvinsiSpecification(filteredProvinsi), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateProvinsi(@Valid @RequestBody MasterProvinsi provinsi, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterProvinsi masterProvinsiSave = masterProvinsiService.saveOrUpdateProvinsi(provinsi);
    return new ResponseEntity<>(masterProvinsiSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{idProvinsi}")
  public ResponseEntity<?> deleteProvinsi(@PathVariable long idProvinsi) {
    try {
      masterProvinsiService.deleteProvinsiById(idProvinsi);
      return new ResponseEntity<>("Provinsi dengan ID: '" + idProvinsi + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
//      return new ResponseEntity<>("Tidak dapat Menghapus Provinsi " + masterProvinsi.getNamaProvinsi() + " Karena masih terdapat Kota didalam nya", HttpStatus.CONFLICT);
    }
  }
}
