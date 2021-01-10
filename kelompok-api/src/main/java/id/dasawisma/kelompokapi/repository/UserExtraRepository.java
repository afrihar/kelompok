package id.dasawisma.kelompokapi.repository;

import id.dasawisma.kelompokapi.model.UserExtra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserExtraRepository extends JpaRepository<UserExtra, String> {
  UserExtra findByUsername(String username);
}
