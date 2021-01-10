package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.exception.ApiRequestException;
import id.dasawisma.kelompokapi.model.UserExtra;
import id.dasawisma.kelompokapi.repository.UserExtraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserExtraService {

  private final UserExtraRepository userExtraRepository;

  public UserExtra findUserExtraByName(String username) {
    UserExtra userExtra = userExtraRepository.findByUsername(username);
    if (userExtra == null) {
      throw new ApiRequestException("UserExtra '" + username + "' tidak ditemukan");
    }
    return userExtra;
  }

  public Optional<UserExtra> getUserExtra(String username) {
    return userExtraRepository.findById(username);
  }

  public UserExtra saveUserExtra(UserExtra userExtra) {
    return userExtraRepository.save(userExtra);
  }
}
