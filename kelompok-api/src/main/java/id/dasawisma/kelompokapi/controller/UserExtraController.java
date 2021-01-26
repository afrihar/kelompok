package id.dasawisma.kelompokapi.controller;

import id.dasawisma.kelompokapi.model.UserExtra;
import id.dasawisma.kelompokapi.service.UserExtraService;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

import static id.dasawisma.kelompokapi.config.SwaggerConfig.BEARER_KEY_SECURITY_SCHEME;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/userextras")
public class UserExtraController {

  private final UserExtraService userExtraService;

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @GetMapping("/me")
  public UserExtra getUserExtra() {
    UserExtra userExtra = userExtraService.validateAndGetUserExtra(PrincipalUtil.getPreferredUsername());
    userExtra.setKodeWilayah(PrincipalUtil.getKodeWilayah());
    return userExtra;
  }

  @Operation(security = {@SecurityRequirement(name = BEARER_KEY_SECURITY_SCHEME)})
  @PostMapping("/me")
  public UserExtra saveUserExtra(@Valid @RequestBody UserExtra updateUserExtraRequest) {
    Optional<UserExtra> userExtraOptional = userExtraService.getUserExtra(PrincipalUtil.getPreferredUsername());
    UserExtra userExtra = userExtraOptional.orElseGet(() -> new UserExtra(PrincipalUtil.getPreferredUsername()));
    userExtra.setAvatar(updateUserExtraRequest.getAvatar());
    userExtra.setKodeWilayah(PrincipalUtil.getKodeWilayah());
    return userExtraService.saveUserExtra(userExtra);
  }

}
