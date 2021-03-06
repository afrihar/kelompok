package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.KelompokDasawisma;
import id.dasawisma.kelompok.model.MasterRt;
import id.dasawisma.kelompok.model.MasterRw;
import id.dasawisma.kelompok.service.*;
import id.dasawisma.kelompok.specification.MasterRtSpecification;
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
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/rt")
public class MasterRtController {
  private final MasterRtService rtService;
  private final MasterRwService rwService;
  private final MasterKelurahanService kelurahanService;
  private final KelompokDasawismaService kelompokDasawismaService;
  private final ValidationErrorService validationErrorService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllRtPageable(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "kodeRt") String sortBy,
      @RequestParam(defaultValue = "ASC") String direction,
      @RequestParam(required = false) String filter,
      @RequestParam(required = false) String filterRw
  ) {
    try {
      Pageable paging = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.valueOf(direction), sortBy));
      MasterRt filteredRt = new MasterRt();
      filteredRt.setNamaKetuaRt(filter);
      filteredRt.setNoHpRt(filter);
      filteredRt.setNoTelpRt(filter);
      filteredRt.setNoTelpRtAlt(filter);
      if (filterRw != null) {
        MasterRw filterMasterRw = new MasterRw();
        filterMasterRw.setKodeRw(filterRw);
        filteredRt.setRw(filterMasterRw);
      }
      return new ResponseEntity<>(PageableUtil.buildPageable(rtService.findAll(
          new MasterRtSpecification(filteredRt), paging)
      ), HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/{kodeRt}")
  public ResponseEntity<?> getRtByKode(@PathVariable String kodeRt) {
    MasterRt masterRt = rtService.findByKode(kodeRt);
    return new ResponseEntity<>(masterRt, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateRt(@Valid @RequestBody MasterRt rt, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    MasterRw rw = rwService.findByKode(rt.getRw().getKodeRw());
    rt.setRw(rw);
    if (rt.getTargetBangunan() != null && rt.getTargetBangunan() > 0) {
      int targetBangunan = rt.getTargetBangunan();
      generateKelompok(rt.getKodeRt(), targetBangunan);
    }
    MasterRt masterRtSave = rtService.saveOrUpdate(rt);
    return new ResponseEntity<>(masterRtSave, HttpStatus.CREATED);
  }

  private void generateKelompok(String kodeRt, int targetBangunan) {
    int jmlKelompokExist = 0;
    if (kelompokDasawismaService.countAllByRtKelompok(kodeRt) != null) {
      jmlKelompokExist = kelompokDasawismaService.countAllByRtKelompok(kodeRt);
    }
    if (targetBangunan > 0) {
      int bagiKelompok = (targetBangunan / 20);
      int modKelompok = (targetBangunan % 20);
      int jumlahKelompok;
      if (modKelompok == 0) jumlahKelompok = bagiKelompok;
      else jumlahKelompok = bagiKelompok + 1;
      if (jumlahKelompok > jmlKelompokExist) {
        for (int i = 0; i < (jumlahKelompok - jmlKelompokExist); i++) {
          KelompokDasawisma kelompokDasawisma = new KelompokDasawisma();
          MasterRt rt = rtService.findByKode(kodeRt);
          kelompokDasawisma.setRtKelompok(rt);
          String templateNamaKelompok = kelurahanService.findByKode(kodeRt.substring(0, 9)).getNamaKelompokKelurahan();
          String namaKelompok = templateNamaKelompok.trim() + "." + rt.getRw().getLabelRw().trim() + "." + rt.getLabelRt().trim() + "." + kelompokDasawismaService.getKelompokNextNumber(kodeRt);
          kelompokDasawisma.setNamaKelompok(namaKelompok);
          kelompokDasawismaService.saveOrUpdate(kelompokDasawisma);
        }
      }
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{kodeRt}")
  public ResponseEntity<?> deleteRt(@PathVariable String kodeRt) {
    try {
      rtService.deleteRtByKode(kodeRt);
      return new ResponseEntity<>("Rt dengan ID: '" + kodeRt + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rw")
  public ResponseEntity<?> getOptionsRw() {
    Iterable<MasterRw> masterRw = null;
    if (PrincipalUtil.isPusdatin())
      masterRw = rwService.findAllByOrderByKelurahan_NamaKelurahanAscLabelRwAsc();
    else if (PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan())
      masterRw = rwService.findAllByKelurahan_KodeKelurahanStartingWithOrderByKelurahan_NamaKelurahanAscLabelRwAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKelurahan())
      masterRw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRw())
      masterRw = rwService.findAllByKodeRw(PrincipalUtil.getKodeWilayah());
    List<Map<String, Object>> response = new ArrayList<>();
    if (masterRw != null) {
      masterRw.forEach(rw -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", rw.getKodeRw());
        map.put("value", rw.getKodeRw());
        map.put("text", rw.getKelurahan().getNamaKelurahan() + " - RW " + rw.getLabelRw());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rt")
  public ResponseEntity<?> getOptionsRt() {
    Iterable<MasterRt> masterRt = null;
    if (PrincipalUtil.isPusdatin())
      masterRt = rtService.findAllByOrderByRw_KodeRwAscLabelRtAsc();
    else if (PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan())
      masterRt = rtService.findAllByRw_KodeRwStartingWithOrderByRw_KodeRwAscKodeRtAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRw())
      masterRt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRt())
      masterRt = rtService.findAllByKodeRt(PrincipalUtil.getKodeWilayah());
    List<Map<String, Object>> response = new ArrayList<>();
    if (masterRt != null) {
      masterRt.forEach(rt -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", rt.getKodeRt());
        map.put("value", rt.getKodeRt());
        map.put("text", "RW " + rt.getRw().getLabelRw() + " - RT " + rt.getLabelRt());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}