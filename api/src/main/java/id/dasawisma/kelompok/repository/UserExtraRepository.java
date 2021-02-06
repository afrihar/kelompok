package id.dasawisma.kelompok.repository;

import id.dasawisma.kelompok.model.UserExtra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserExtraRepository extends JpaRepository<UserExtra, String> {
  UserExtra findByUsername(String username);
}
