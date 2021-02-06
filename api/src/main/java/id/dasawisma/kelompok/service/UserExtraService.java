package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.exception.UserExtraNotFoundException;
import id.dasawisma.kelompok.model.UserExtra;
import id.dasawisma.kelompok.repository.UserExtraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserExtraService implements UserExtraServiceInterface {

  private final UserExtraRepository userExtraRepository;

  @Override
  public UserExtra validateAndGetUserExtra(String username) {
    return getUserExtra(username).orElseThrow(() -> new UserExtraNotFoundException(username));
  }

  @Override
  public Optional<UserExtra> getUserExtra(String username) {
    return userExtraRepository.findById(username);
  }

  @Override
  public UserExtra saveUserExtra(UserExtra userExtra) {
    return userExtraRepository.save(userExtra);
  }
}