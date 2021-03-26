package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.exception.ApiRequestException;
import id.dasawisma.kelompok.model.*;
import id.dasawisma.kelompok.service.*;
import id.dasawisma.kelompok.specification.KelompokDasawismaSpecification;
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
@RequestMapping("/api/kelompok")
public class KelompokDasawismaController {
  private final ValidationErrorService validationErrorService;
  private final KelompokDasawismaService kelompokDasawismaService;
  private final MasterKotaService kotaService;
  private final MasterKecamatanService kecamatanService;
  private final MasterKelurahanService kelurahanService;
  private final MasterRwService rwService;
  private final MasterRtService rtService;
  private final PetugasService petugasService;
  private final BangunanService bangunanService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping
  public ResponseEntity<?> saveOrUpdateKelompok(@Valid @RequestBody KelompokDasawisma kelompokDasawisma, BindingResult result) {
    ResponseEntity<?> errorMap = validationErrorService.ValidationService(result);
    if (errorMap != null) return errorMap;
    if (kelompokDasawisma.getRtKelompok() != null && !kelompokDasawisma.getRtKelompok().getKodeRt().isBlank()) {
      MasterRt rt = rtService.findByKode(kelompokDasawisma.getRtKelompok().getKodeRt());
      kelompokDasawisma.setRtKelompok(rt);
    } else {
      kelompokDasawisma.setRtKelompok(null);
    }
    if (kelompokDasawisma.getPetugasKelompok() != null && !kelompokDasawisma.getPetugasKelompok().getNik().isBlank()) {
      Petugas petugas = petugasService.findByNik(kelompokDasawisma.getPetugasKelompok().getNik());
      kelompokDasawisma.setPetugasKelompok(petugas);
    } else {
      kelompokDasawisma.setPetugasKelompok(null);
    }
    if (kelompokDasawisma.getTargetBangunanKelompok() != null && kelompokDasawisma.getTargetBangunanKelompok() <= 20) {
      generateBangunan(kelompokDasawisma.getId(), kelompokDasawisma.getTargetBangunanKelompok());
    }
    KelompokDasawisma kelompokDasawismaSave = kelompokDasawismaService.saveOrUpdate(kelompokDasawisma);
    return new ResponseEntity<>(kelompokDasawismaSave, HttpStatus.CREATED);
  }

  private void generateBangunan(long idKelompok, int targetBangunan) {
    int jmlBangunanExist = 0;
    if (kelompokDasawismaService.countBangunanByIdKelompok(idKelompok) != null) {
      jmlBangunanExist = kelompokDasawismaService.countBangunanByIdKelompok(idKelompok);
    }
    if (targetBangunan > 0) {
      if (targetBangunan > jmlBangunanExist) {
        for (int i = 0; i < (targetBangunan - jmlBangunanExist); i++) {
          Bangunan bangunan = new Bangunan();
          KelompokDasawisma kelompokDasawisma = kelompokDasawismaService.findById(idKelompok);
          bangunan.setKelompokBangunan(kelompokDasawisma);
          bangunan.setNoUrut(bangunanService.getLastNoUrutByIdKelompok(idKelompok) + 1);
          bangunanService.saveOrUpdate(bangunan);
        }
      }
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @DeleteMapping("/{idKelompok}")
  public ResponseEntity<?> deleteKelompok(@PathVariable Long idKelompok) {
    try {
      kelompokDasawismaService.deleteById(idKelompok);
      return new ResponseEntity<>("Kelompok dengan Id: '" + idKelompok + "' Telah dihapus", HttpStatus.ACCEPTED);
    } catch (Exception e) {
      throw new ApiRequestException(e.getLocalizedMessage());
    }
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping
  public ResponseEntity<Map<String, Object>> getAllKelompokDasawismaPageable(
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
        filterKelompokDasawisma.setRtKelompok(filterMasterRt);
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
  public ResponseEntity<?> getKelompokDasawismaById(@PathVariable Long idKelompok) {
    KelompokDasawisma kelompokDasawisma = kelompokDasawismaService.findById(idKelompok);
    return new ResponseEntity<>(kelompokDasawisma, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kota")
  public ResponseEntity<?> getKelompokOptionsKota() {
    Iterable<MasterKota> kota = null;
    if (PrincipalUtil.isPusdatin())
      kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc("31");
    else if (PrincipalUtil.isProvinsi())
      kota = kotaService.findAllByProvinsi_KodeProvinsiOrderByNamaKotaAsc(PrincipalUtil.getKodeProvinsi());
    else if (PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kota = kotaService.findAllByKodeKota(PrincipalUtil.getKodeKota());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kota != null) {
      kota.forEach(k -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", k.getKodeKota());
        map.put("value", k.getKodeKota());
        map.put("text", k.getNamaKota());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kecamatan/{kodeKota}")
  public ResponseEntity<?> getKelompokOptionsKecamatan(@PathVariable String kodeKota) {
    Iterable<MasterKecamatan> kecamatan = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi())
      kecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(kodeKota);
    else if (PrincipalUtil.isKota())
      kecamatan = kecamatanService.findAllByKota_KodeKotaOrderByNamaKecamatanAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kecamatan = kecamatanService.findAllByKodeKecamatan(PrincipalUtil.getKodeKecamatan());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kecamatan != null) {
      kecamatan.forEach(kec -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kec.getKodeKecamatan());
        map.put("value", kec.getKodeKecamatan());
        map.put("text", kec.getNamaKecamatan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-kelurahan/{kodeKecamatan}")
  public ResponseEntity<?> getKelompokOptionsKelurahan(@PathVariable String kodeKecamatan) {
    Iterable<MasterKelurahan> kelurahan = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota())
      kelurahan = kelurahanService.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(kodeKecamatan);
    else if (PrincipalUtil.isKecamatan())
      kelurahan = kelurahanService.findAllByKecamatan_KodeKecamatanOrderByNamaKelurahan(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isKelurahan() || PrincipalUtil.isRw() || PrincipalUtil.isRt())
      kelurahan = kelurahanService.findAllByKodeKelurahan(PrincipalUtil.getKodeKelurahan());
    List<Map<String, Object>> response = new ArrayList<>();
    if (kelurahan != null) {
      kelurahan.forEach(kel -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", kel.getKodeKelurahan());
        map.put("value", kel.getKodeKelurahan());
        map.put("text", kel.getNamaKelurahan());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rw/{kodeKelurahan}")
  public ResponseEntity<?> getKelompokOptionsRw(@PathVariable String kodeKelurahan) {
    Iterable<MasterRw> rw = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan())
      rw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(kodeKelurahan);
    else if (PrincipalUtil.isKelurahan())
      rw = rwService.findAllByKelurahan_KodeKelurahanOrderByKelurahan_NamaKelurahanAscLabelRwAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRw() || PrincipalUtil.isRt())
      rw = rwService.findAllByKodeRw(PrincipalUtil.getKodeRw());
    List<Map<String, Object>> response = new ArrayList<>();
    if (rw != null) {
      rw.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getKodeRw());
        map.put("value", r.getKodeRw());
        map.put("text", "RW " + r.getLabelRw());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-rt/{kodeRw}")
  public ResponseEntity<?> getKelompokOptionsRt(@PathVariable String kodeRw) {
    Iterable<MasterRt> rt = null;
    if (PrincipalUtil.isPusdatin() || PrincipalUtil.isProvinsi() || PrincipalUtil.isKota() || PrincipalUtil.isKecamatan() || PrincipalUtil.isKelurahan())
      rt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(kodeRw);
    else if (PrincipalUtil.isRw())
      rt = rtService.findAllByRw_KodeRwOrderByRw_KodeRwAscKodeRtAsc(PrincipalUtil.getKodeWilayah());
    else if (PrincipalUtil.isRt())
      rt = rtService.findAllByKodeRt(PrincipalUtil.getKodeRt());
    List<Map<String, Object>> response = new ArrayList<>();
    if (rt != null) {
      rt.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getKodeRt());
        map.put("value", r.getKodeRt());
        map.put("text", "RT " + r.getLabelRt());
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/options-petugas/{kodeRtTugas}")
  public ResponseEntity<?> getKelompokOptionsPetugasByRtTugas(@PathVariable String kodeRtTugas) {
    Iterable<Petugas> petugas = null;
    if (PrincipalUtil.isPusdatin()
        || PrincipalUtil.isProvinsi()
        || PrincipalUtil.isKota()
        || PrincipalUtil.isKecamatan()
        || PrincipalUtil.isKelurahan()
        || PrincipalUtil.isRw())
      petugas = petugasService.findAllByRtTugas_KodeRtStartingWithOrderByNamaAsc(kodeRtTugas);
    else if (PrincipalUtil.isRt())
      petugas = petugasService.findAllByRtTugas_KodeRtStartingWithOrderByNamaAsc(PrincipalUtil.getKodeRt());
    List<Map<String, Object>> response = new ArrayList<>();
    if (petugas != null) {
      petugas.forEach(r -> {
        Map<String, Object> map = new HashMap<>();
        map.put("key", r.getNik());
        map.put("value", r.getNik());
        map.put("text", r.getNama() + " (" + r.getNik() + ")");
        response.add(map);
      });
    }
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/kelurahan-detail/{kodeKelurahan}")
  public ResponseEntity<?> getKelompokDetailKelurahan(@PathVariable String kodeKelurahan) {
    MasterKelurahan masterKelurahan = kelurahanService.findByKode(kodeKelurahan);
    return new ResponseEntity<>(masterKelurahan, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/next-number/{kodeRt}")
  public ResponseEntity<?> getKelompokNextNumber(@PathVariable String kodeRt) {
    String nextNumberString = kelompokDasawismaService.getKelompokNextNumber(kodeRt);
    return new ResponseEntity<>(nextNumberString, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/sum/{kodeRt}")
  public ResponseEntity<?> getSumKelompokByRt(@PathVariable String kodeRt) {
    int jumlahKelompok = kelompokDasawismaService.countAllByRtKelompok(kodeRt);
    return new ResponseEntity<>(jumlahKelompok, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/rt/{kodeRt}")
  public ResponseEntity<?> getKelompokByRt(@PathVariable String kodeRt) {
    Iterable<KelompokDasawisma> kelompok;
    kelompok = kelompokDasawismaService.findAllByRtKelompok_KodeRtOrderByNamaKelompok(kodeRt);
    List<Map<String, Object>> response = new ArrayList<>();
    kelompok.forEach(kel -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", kel.getId());
      map.put("value", kel.getId());
      if (kel.getPetugasKelompok() == null) {
        map.put("text", kel.getNamaKelompok());
      } else {
        map.put("text", kel.getNamaKelompok() + " : " + kel.getPetugasKelompok().getNama());
      }
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/jmlBangunan/{idKelompok}")
  public ResponseEntity<?> getJumlahBangunanByIdKelompok(@PathVariable Long idKelompok) {
    Integer jml = kelompokDasawismaService.countBangunanByIdKelompok(idKelompok);
    return new ResponseEntity<>(jml, HttpStatus.OK);
  }
}