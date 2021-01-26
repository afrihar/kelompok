package id.dasawisma.kelompokapi.specification;

import id.dasawisma.kelompokapi.model.KelompokDasawisma;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class KelompokDasawismaSpecification implements Specification<KelompokDasawisma> {
  private final KelompokDasawisma filteredKelompokDasawisma;

  public KelompokDasawismaSpecification(KelompokDasawisma filteredKelompokDasawisma) {
    this.filteredKelompokDasawisma = filteredKelompokDasawisma;
  }

  private Predicate buildAll(Root<KelompokDasawisma> root, CriteriaBuilder cb) {
    return cb.like(root.get("nik"), "%");
  }

  private Predicate buildFilterByString(Root<KelompokDasawisma> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("namaKelompok")), "%" + filteredKelompokDasawisma.getNamaKelompok().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("rt").get("labelRt")), "%" + filteredKelompokDasawisma.getNamaKelompok().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterByWilayah(Root<KelompokDasawisma> root, CriteriaBuilder cb) {
    return cb.like(root.get("rt").get("kodeRt"), filteredKelompokDasawisma.getRt().getKodeRt() + "%");
  }

  private Predicate buildFilterByPrincipal(Root<KelompokDasawisma> root, CriteriaBuilder cb) {
    return cb.like(root.get("rt").get("kodeRt"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAll(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAll(root, cb));
  }

  private void filterByString(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByString(root, cb));
  }

  private void filterByWilayah(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByWilayah(root, cb));
  }

  private void filterByPrincipal(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterByStringAndWilayah(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb)
    ));
  }

  private void filterByStringAndPrincipal(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByWilayahAndPrincipal(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByStringAndWilayahAndPrincipal(Root<KelompokDasawisma> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<KelompokDasawisma> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredKelompokDasawisma.getRt() != null && filteredKelompokDasawisma.getRt().getKodeRt() != null) {
        if (filteredKelompokDasawisma.getNamaKelompok() != null) filterByStringAndWilayah(root, cb, predicate);
        else filterByWilayah(root, cb, predicate);
      } else {
        if (filteredKelompokDasawisma.getNamaKelompok() != null) filterByString(root, cb, predicate);
        else getAll(root, cb, predicate);
      }
    } else {
      if (filteredKelompokDasawisma.getRt() != null && filteredKelompokDasawisma.getRt().getKodeRt() != null) {
        if (filteredKelompokDasawisma.getNamaKelompok() != null)
          filterByStringAndWilayahAndPrincipal(root, cb, predicate);
        else filterByWilayahAndPrincipal(root, cb, predicate);
      } else {
        if (filteredKelompokDasawisma.getNamaKelompok() != null) filterByStringAndPrincipal(root, cb, predicate);
        else filterByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}