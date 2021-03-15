package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.RumahTangga;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class RumahTanggaSpecification implements Specification<RumahTangga> {
  private final RumahTangga filteredRumahTangga;

  public RumahTanggaSpecification(RumahTangga filteredRumahTangga) {
    this.filteredRumahTangga = filteredRumahTangga;
  }

  private Predicate buildAll(Root<RumahTangga> root, CriteriaBuilder cb) {
    return cb.like(root.get("id").as(String.class), "%");
  }

  private Predicate buildFilterByString(Root<RumahTangga> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("id").as(String.class)),
            "%" + filteredRumahTangga.getId().toString().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterByWilayah(Root<RumahTangga> root, CriteriaBuilder cb) {
    return cb.like(root.get("bangunanRumahTangga").get("kelompokBangunan").get("rtKelompok").get("kodeRt"),
        filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan().getRtKelompok().getKodeRt() + "%");
  }

  private Predicate buildFilterByPrincipal(Root<RumahTangga> root, CriteriaBuilder cb) {
    return cb.like(root.get("bangunanRumahTangga").get("kelompokBangunan").get("rtKelompok").get("kodeRt"),
        PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAll(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAll(root, cb));
  }

  private void filterByString(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByString(root, cb));
  }

  private void filterByWilayah(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByWilayah(root, cb));
  }

  private void filterByPrincipal(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterByStringAndWilayah(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb)
    ));
  }

  private void filterByStringAndPrincipal(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByWilayahAndPrincipal(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByStringAndWilayahAndPrincipal(Root<RumahTangga> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<RumahTangga> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> query,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredRumahTangga.getBangunanRumahTangga() != null
          && filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan() != null
          && filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan().getRtKelompok() != null
          && filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan().getRtKelompok().getKodeRt() != null) {
        if (filteredRumahTangga.getId().toString() != null) filterByStringAndWilayah(root, cb, predicate);
        else filterByWilayah(root, cb, predicate);
      } else {
        if (filteredRumahTangga.getId().toString() != null) filterByString(root, cb, predicate);
        else getAll(root, cb, predicate);
      }
    } else {
      if (filteredRumahTangga.getBangunanRumahTangga() != null
          && filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan() != null
          && filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan().getRtKelompok() != null
          && filteredRumahTangga.getBangunanRumahTangga().getKelompokBangunan().getRtKelompok().getKodeRt() != null) {
        if (filteredRumahTangga.getId().toString() != null)
          filterByStringAndWilayahAndPrincipal(root, cb, predicate);
        else filterByWilayahAndPrincipal(root, cb, predicate);
      } else {
        if (filteredRumahTangga.getId().toString() != null)
          filterByStringAndPrincipal(root, cb, predicate);
        else filterByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}