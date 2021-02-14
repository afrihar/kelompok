package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.MasterProvinsi;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class MasterProvinsiSpecification implements Specification<MasterProvinsi> {
  private final MasterProvinsi filteredProvinsi;

  public MasterProvinsiSpecification(MasterProvinsi filteredProvinsi) {
    this.filteredProvinsi = filteredProvinsi;
  }

  private Predicate buildAllProvinsi(Root<MasterProvinsi> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeProvinsi"), "%");
  }

  private Predicate buildFilterProvinsiByString(Root<MasterProvinsi> root, CriteriaBuilder cb) {
    return cb.like(cb.lower(root.get("namaProvinsi")), "%" + filteredProvinsi.getNamaProvinsi().toLowerCase() + "%");
  }

  private Predicate buildFilterByPrincipal(Root<MasterProvinsi> root, CriteriaBuilder cb) {
    return cb.equal(root.get("kodeProvinsi"), PrincipalUtil.getKodeProvinsi());
  }

  private void getAllProvinsi(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllProvinsi(root, cb));
  }

  private void filterProvinsiByString(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterProvinsiByString(root, cb));
  }

  private void filterProvinsiByPrincipal(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterProvinsiByStringAndByPrincipal(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterProvinsiByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<MasterProvinsi> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder criteriaBuilder) {
    Predicate predicate = criteriaBuilder.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredProvinsi.getNamaProvinsi() != null) filterProvinsiByString(root, criteriaBuilder, predicate);
      else getAllProvinsi(root, criteriaBuilder, predicate);
    } else {
      if (filteredProvinsi.getNamaProvinsi() != null)
        filterProvinsiByStringAndByPrincipal(root, criteriaBuilder, predicate);
      else filterProvinsiByPrincipal(root, criteriaBuilder, predicate);
    }
    return predicate;
  }
}
