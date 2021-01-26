package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.*;
import id.dasawisma.kelompokapi.service.*;
import id.dasawisma.kelompokapi.specification.KetuaDasawismaSpecification;
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
@RequestMapping("/api/kader")
public class KetuaDasawismaController {
  private final KetuaDasawismaService ketuaDasawismaService;
  private final MasterKotaService kotaService;
  private final MasterKecamatanService kecamatanService;
  private final MasterKelurahanService kelurahanService;
  private final MasterRwService rwService;
  private final MasterRtService rtService;
  private final PetugasService petugasService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllKaderPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "noKader") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterWilayah
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      KetuaDasawisma filterKetuaDasawisma = new KetuaDasawisma();
      if (filter != null) {
        filterKetuaDasawisma.setNoKader(filter);
      }
      if (filterWilayah != null) {
        MasterRt filterMasterRt = new MasterRt();
        filterMasterRt.setKodeRt(filterWilayah);
        filterKetuaDasawisma.setRt(filterMasterRt);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(ketuaDasawismaService.findAll(
          new KetuaDasawismaSpecification(filterKetuaDasawisma), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{noKader}")
  public ResponseEntity<?> getKaderByNomor(@PathVariable String noKader) {
    KetuaDasawisma ketuaDasawisma = ketuaDasawismaService.findByNoKader(noKader);
    return new ResponseEntity<>(ketuaDasawisma, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kota")
  public ResponseEntity<?> getKaderOptionsKota() {
    Iterable<MasterKota> kota;
    if (PrincipalUtil.isPusdatin()) {
      kota = kotaService.findAllByKodeKotaStartingWith("31");
    } else if (PrincipalUtil.isProvinsi()) {
      kota = kotaService.findAllByKodeKotaStartingWith(PrincipalUtil.getKodeWilayah());
    } else {
      kota = kotaService.findAllByKodeKotaStartingWith(PrincipalUtil.getKodeWilayah().substring(0, 4));
    }
    List<Map<String, Object>> response = new ArrayList<>();
    kota.forEach(k -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", k.getKodeKota());
      map.put("value", k.getKodeKota());
      map.put("text", k.getNamaKota());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kecamatan/{kodeKota}")
  public ResponseEntity<?> getKaderOptionsKecamatan(@PathVariable String kodeKota) {
    Iterable<MasterKecamatan> kecamatan;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi()) {
      kecamatan = kecamatanService.findAllByKodeKecamatanStartingWith(kodeKota);
    } else if (PrincipalUtil.isKota()) {
      kecamatan = kecamatanService.findAllByKodeKecamatanStartingWith(PrincipalUtil.getKodeWilayah());
    } else {
      kecamatan = kecamatanService.findAllByKodeKecamatanStartingWith(PrincipalUtil.getKodeWilayah().substring(0, 7));
    }
    List<Map<String, Object>> response = new ArrayList<>();
    kecamatan.forEach(kec -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", kec.getKodeKecamatan());
      map.put("value", kec.getKodeKecamatan());
      map.put("text", kec.getNamaKecamatan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kelurahan/{kodeKecamatan}")
  public ResponseEntity<?> getKaderOptionsKelurahan(@PathVariable String kodeKecamatan) {
    Iterable<MasterKelurahan> kelurahan;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota()) {
      kelurahan = kelurahanService.findAllByKodeKelurahanStartingWith(kodeKecamatan);
    } else if (PrincipalUtil.isKecamatan()) {
      kelurahan = kelurahanService.findAllByKodeKelurahanStartingWith(PrincipalUtil.getKodeWilayah());
    } else {
      kelurahan = kelurahanService.findAllByKodeKelurahanStartingWith(PrincipalUtil.getKodeWilayah().substring(0, 10));
    }
    List<Map<String, Object>> response = new ArrayList<>();
    kelurahan.forEach(kel -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", kel.getKodeKelurahan());
      map.put("value", kel.getKodeKelurahan());
      map.put("text", kel.getNamaKelurahan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rw/{kodeKelurahan}")
  public ResponseEntity<?> getKaderOptionsRw(@PathVariable String kodeKelurahan) {
    Iterable<MasterRw> rw;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan()) {
      rw = rwService.findAllByKodeRwStartingWith(kodeKelurahan);
    } else if (PrincipalUtil.isKelurahan()) {
      rw = rwService.findAllByKodeRwStartingWith(PrincipalUtil.getKodeWilayah());
    } else {
      rw = rwService.findAllByKodeRwStartingWith(PrincipalUtil.getKodeWilayah().substring(0, 13));
    }
    List<Map<String, Object>> response = new ArrayList<>();
    rw.forEach(r -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", r.getKodeRw());
      map.put("value", r.getKodeRw());
      map.put("text", "RW " + r.getLabelRw());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rt/{kodeRw}")
  public ResponseEntity<?> getKaderOptionsRt(@PathVariable String kodeRw) {
    Iterable<MasterRt> rt;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan()) {
      rt = rtService.findAllByKodeRtStartingWith(kodeRw);
    } else if (PrincipalUtil.isRw()) {
      rt = rtService.findAllByKodeRtStartingWith(PrincipalUtil.getKodeWilayah());
    } else {
      rt = rtService.findAllByKodeRtStartingWith(PrincipalUtil.getKodeWilayah().substring(0, 16));
    }
    List<Map<String, Object>> response = new ArrayList<>();
    rt.forEach(r -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", r.getKodeRt());
      map.put("value", r.getKodeRt());
      map.put("text", "RT " + r.getLabelRt());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-petugas/{kodeRt}")
  public ResponseEntity<?> getOptionsPetugas(@PathVariable String kodeRt) {
    Iterable<Petugas> petugas;
    petugas = petugasService.findAllByRtDomisili_KodeRtOrderByNamaAsc(kodeRt);
    List<Map<String, Object>> response = new ArrayList<>();
    petugas.forEach(p -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", p.getNik());
      map.put("value", p.getNik());
      map.put("text", p.getNama() + " - " + p.getNik());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateKader(@Valid @RequestBody KetuaDasawisma ketuaDasawisma, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    if (ketuaDasawisma.getPetugas() != null && !ketuaDasawisma.getPetugas().getNik().isBlank()) {
      Petugas petugas = petugasService.findByNik(ketuaDasawisma.getPetugas().getNik());
      ketuaDasawisma.setPetugas(petugas);
    }
    MasterRt rt = rtService.findByKode(ketuaDasawisma.getRt().getKodeRt());
    ketuaDasawisma.setRt(rt);
    KetuaDasawisma KaderSave = ketuaDasawismaService.saveOrUpdate(ketuaDasawisma);
    return new ResponseEntity<>(KaderSave, HttpStatus.CREATED);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{noKader}")
  public ResponseEntity<?> deleteKader(@PathVariable String noKader) {
    try {
      ketuaDasawismaService.deleteByNoKader(noKader);
      return new ResponseEntity<>("Kader dengan nomor: '" + noKader + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }
}