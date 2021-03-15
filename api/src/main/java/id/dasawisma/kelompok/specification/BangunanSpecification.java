package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.Bangunan;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class BangunanSpecification implements Specification<Bangunan> {
  private final Bangunan filteredBangunan;

  public BangunanSpecification(Bangunan filteredBangunan) {
    this.filteredBangunan = filteredBangunan;
  }

  private Predicate buildAll(Root<Bangunan> root, CriteriaBuilder cb) {
    return cb.like(root.get("identifikasi"), "%");
  }

  private Predicate buildFilterByString(Root<Bangunan> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("identifikasi")), "%" + filteredBangunan.getIdentifikasi().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterByWilayah(Root<Bangunan> root, CriteriaBuilder cb) {
    return cb.equal(root.get("kelompokBangunan").get("id"), filteredBangunan.getKelompokBangunan().getId());
  }

  private Predicate buildFilterByPrincipal(Root<Bangunan> root, CriteriaBuilder cb) {
    return cb.like(root.get("kelompokBangunan").get("rtKelompok").get("kodeRt"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAll(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAll(root, cb));
  }

  private void filterByString(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByString(root, cb));
  }

  private void filterByWilayah(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByWilayah(root, cb));
  }

  private void filterByPrincipal(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterByStringAndWilayah(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb)
    ));
  }

  private void filterByStringAndPrincipal(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByWilayahAndPrincipal(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByStringAndWilayahAndPrincipal(Root<Bangunan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<Bangunan> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> query,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredBangunan.getKelompokBangunan() != null
          && filteredBangunan.getKelompokBangunan().getId() != null) {
        if (filteredBangunan.getIdentifikasi() != null)
          filterByStringAndWilayah(root, cb, predicate);
        else filterByWilayah(root, cb, predicate);
      } else {
        if (filteredBangunan.getIdentifikasi() != null) filterByString(root, cb, predicate);
        else getAll(root, cb, predicate);
      }
    } else {
      if (filteredBangunan.getKelompokBangunan() != null
          && filteredBangunan.getKelompokBangunan().getId() != null) {
        if (filteredBangunan.getIdentifikasi() != null)
          filterByStringAndWilayahAndPrincipal(root, cb, predicate);
        else filterByWilayahAndPrincipal(root, cb, predicate);
      } else {
        if (filteredBangunan.getIdentifikasi() != null)
          filterByStringAndPrincipal(root, cb, predicate);
        else filterByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}
