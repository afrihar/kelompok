package id.dasawisma.kelompok.service;

import id.dasawisma.kelompok.model.UserExtra;

import java.util.Optional;

public interface UserExtraServiceInterface {

  UserExtra validateAndGetUserExtra(String username);

  Optional<UserExtra> getUserExtra(String username);

  UserExtra saveUserExtra(UserExtra userExtra);
}
