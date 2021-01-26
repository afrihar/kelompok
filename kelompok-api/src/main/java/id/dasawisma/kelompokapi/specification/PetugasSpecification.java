package id.dasawisma.kelompokapi.specification;

import id.dasawisma.kelompokapi.model.Petugas;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class PetugasSpecification implements Specification<Petugas> {
  private final Petugas filteredPetugas;

  public PetugasSpecification(Petugas filteredPetugas) {
    this.filteredPetugas = filteredPetugas;
  }

  private Predicate buildAll(Root<Petugas> root, CriteriaBuilder cb) {
    return cb.like(root.get("nik"), "%");
  }

  private Predicate buildFilterByString(Root<Petugas> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("nik")), "%" + filteredPetugas.getNik().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("nama")), "%" + filteredPetugas.getNik().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noHpPetugas")), "%" + filteredPetugas.getNoHpPetugas().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noTelpPetugas")), "%" + filteredPetugas.getNoTelpPetugas().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("email")), "%" + filteredPetugas.getEmail().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noRekening")), "%" + filteredPetugas.getNoRekening().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noNpwp")), "%" + filteredPetugas.getNoNpwp().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterByWilayah(Root<Petugas> root, CriteriaBuilder cb) {
    return cb.like(root.get("rtDomisili").get("kodeRt"), filteredPetugas.getRtDomisili().getKodeRt() + "%");
  }

  private Predicate buildFilterByPrincipal(Root<Petugas> root, CriteriaBuilder cb) {
    return cb.like(root.get("rt").get("kodeRt"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAll(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAll(root, cb));
  }

  private void filterByString(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByString(root, cb));
  }

  private void filterByWilayah(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByWilayah(root, cb));
  }

  private void filterByPrincipal(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterByStringAndWilayah(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb)
    ));
  }

  private void filterByStringAndPrincipal(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByWilayahAndPrincipal(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterByStringAndWilayahAndPrincipal(Root<Petugas> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterByString(root, cb),
        buildFilterByWilayah(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<Petugas> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredPetugas.getRtDomisili() != null && filteredPetugas.getRtDomisili().getKodeRt() != null) {
        if (filteredPetugas.getNik() != null) filterByStringAndWilayah(root, cb, predicate);
        else filterByWilayah(root, cb, predicate);
      } else {
        if (filteredPetugas.getNik() != null) filterByString(root, cb, predicate);
        else getAll(root, cb, predicate);
      }
    } else {
      if (filteredPetugas.getRtDomisili() != null && filteredPetugas.getRtDomisili().getKodeRt() != null) {
        if (filteredPetugas.getNik() != null)
          filterByStringAndWilayahAndPrincipal(root, cb, predicate);
        else filterByWilayahAndPrincipal(root, cb, predicate);
      } else {
        if (filteredPetugas.getNik() != null) filterByStringAndPrincipal(root, cb, predicate);
        else filterByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}