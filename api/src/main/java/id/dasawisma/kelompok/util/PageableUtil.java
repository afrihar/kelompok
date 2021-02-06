package id.dasawisma.kelompok.util;

import org.springframework.data.domain.Page;

import java.util.HashMap;
import java.util.Map;

public final class PageableUtil {
  public static Map<String, Object> buildPageable(Page<?> page) {
    Map<String, Object> response = new HashMap<>();
    response.put("data", page.getContent());
    response.put("currentPage", page.getNumber() + 1);
    response.put("totalItems", page.getTotalElements());
    response.put("totalPages", page.getTotalPages());
    return response;
  }
}