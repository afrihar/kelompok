package id.dasawisma.kelompok.controller;

import id.dasawisma.kelompok.model.*;
import id.dasawisma.kelompok.service.OptionsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static id.dasawisma.kelompok.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/options")
public class OptionsController {
  private final OptionsService optionsService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/agama")
  public ResponseEntity<?> getOptionsAgama() {
    Iterable<OptionAgama> agama = optionsService.findAllAgama();
    List<Map<String, Object>> response = new ArrayList<>();
    agama.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelAgama());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/hubungan-emergency")
  public ResponseEntity<?> getOptionsHubunganEmergency() {
    Iterable<OptionHubunganEmergency> hubunganEmergency = optionsService.findAllHubunganEmergency();
    List<Map<String, Object>> response = new ArrayList<>();
    hubunganEmergency.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelHubunganEmergency());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/pekerjaan")
  public ResponseEntity<?> getOptionsPekerjaan() {
    Iterable<OptionPekerjaan> pekerjaan = optionsService.findAllPekerjaan();
    List<Map<String, Object>> response = new ArrayList<>();
    pekerjaan.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelPekerjaan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/pendidikan")
  public ResponseEntity<?> getOptionsPendidikan() {
    Iterable<OptionPendidikan> pendidikan = optionsService.findAllPendidikan();
    List<Map<String, Object>> response = new ArrayList<>();
    pendidikan.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelPendidikan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/status-kepemilikan-rumah")
  public ResponseEntity<?> getOptionsStatusKepemilikanRumah() {
    Iterable<OptionStatusKepemilikanRumah> statusKepemilikanRumah = optionsService.findAllStatusKepemilikanRumah();
    List<Map<String, Object>> response = new ArrayList<>();
    statusKepemilikanRumah.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelStatusKepemilikanRumah());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/status-pekerjaan")
  public ResponseEntity<?> getOptionsStatusPekerjaan() {
    Iterable<OptionStatusPekerjaan> statusPekerjaan = optionsService.findAllStatusPekerjaan();
    List<Map<String, Object>> response = new ArrayList<>();
    statusPekerjaan.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelStatusPekerjaan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/status-pernikahan")
  public ResponseEntity<?> getOptionsStatusPernikahan() {
    Iterable<OptionStatusPernikahan> statusPernikahan = optionsService.findAllStatusPernikahan();
    List<Map<String, Object>> response = new ArrayList<>();
    statusPernikahan.forEach(a -> {
      Map<String, Object> map = new HashMap<>();
      map.put("key", a.getId());
      map.put("value", a.getId());
      map.put("text", a.getLabelStatusPernikahan());
      response.add(map);
    });
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
}