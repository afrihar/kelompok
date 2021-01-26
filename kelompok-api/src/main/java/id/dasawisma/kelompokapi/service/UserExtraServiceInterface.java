package id.dasawisma.kelompokapi.service;

import id.dasawisma.kelompokapi.model.UserExtra;

import java.util.Optional;

public interface UserExtraServiceInterface {

  UserExtra validateAndGetUserExtra(String username);

  Optional<UserExtra> getUserExtra(String username);

  UserExtra saveUserExtra(UserExtra userExtra);
}
