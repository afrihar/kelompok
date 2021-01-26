package id.dasawisma.kelompokapi.specification;

import id.dasawisma.kelompokapi.model.KetuaDasawisma;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class KetuaDasawismaSpecification implements Specification<KetuaDasawisma> {
  private final KetuaDasawisma filteredKetuaDasawisma;

  public KetuaDasawismaSpecification(KetuaDasawisma filteredKetuaDasawisma) {
    this.filteredKetuaDasawisma = filteredKetuaDasawisma;
  }

  private Predicate buildAll(Root<KetuaDasawisma> root, CriteriaBuilder cb) {
    return cb.like(root.get("noKader"), "%");
  }

  private Predicate buildFilterByString(Root<KetuaDasawisma> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("noKader")), "%" + filteredKetuaDasawisma.getNoKader().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("petugas").get("nik")), "%" + filteredKetuaDasawisma.getNoKader().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterByWilayah(Root<KetuaDasawisma> root, CriteriaBuilder cb) {
    return cb.like(root.get("rt").get("kodeRt"), filteredKetuaDasawisma.getRt().getKodeRt() + "%");
  }

  private Predicate buildFilterByPrincipal(Root<KetuaDasawisma> root, CriteriaBuilder cb) {
    return cb.like(root.get("rt").get("kodeRt"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAll(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAll(root, cb));
  }

  private void filterByString(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByString(root, cb));
  }

  private void filterByWilayah(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByWilayah(root, cb));
  }

  private void filterByPrincipal(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterByStringAndWilayah(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb)
    ));
  }

  private void filterByStringAndPrincipal(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByWilayahAndPrincipal(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByStringAndWilayahAndPrincipal(Root<KetuaDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<KetuaDasawisma> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredKetuaDasawisma.getRt() != null && filteredKetuaDasawisma.getRt().getKodeRt() != null) {
        if (filteredKetuaDasawisma.getNoKader() != null) filterByStringAndWilayah(root, cb, predicate);
        else filterByWilayah(root, cb, predicate);
      } else {
        if (filteredKetuaDasawisma.getNoKader() != null) filterByString(root, cb, predicate);
        else getAll(root, cb, predicate);
      }
    } else {
      if (filteredKetuaDasawisma.getRt() != null && filteredKetuaDasawisma.getRt().getKodeRt() != null) {
        if (filteredKetuaDasawisma.getNoKader() != null)
          filterByStringAndWilayahAndPrincipal(root, cb, predicate);
        else filterByWilayahAndPrincipal(root, cb, predicate);
      } else {
        if (filteredKetuaDasawisma.getNoKader() != null) filterByStringAndPrincipal(root, cb, predicate);
        else filterByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}