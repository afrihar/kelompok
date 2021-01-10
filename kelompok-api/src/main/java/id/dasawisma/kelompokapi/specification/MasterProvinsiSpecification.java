package id.dasawisma.kelompokapi.specification;

import id.dasawisma.kelompokapi.model.MasterProvinsi;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
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

  private Predicate buildFilterKodeWilayah(Root<MasterProvinsi> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeProvinsi"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAllProvinsi(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllProvinsi(root, cb));
  }

  private void filterProvinsiByString(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterProvinsiByString(root, cb));
  }

  private void filterProvinsiByKodeWilayah(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKodeWilayah(root, cb));
  }

  private void filterProvinsiByStringAndKodeWilayah(Root<MasterProvinsi> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterProvinsiByString(root, cb),
        buildFilterKodeWilayah(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(Root<MasterProvinsi> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
    Predicate predicate = criteriaBuilder.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredProvinsi.getNamaProvinsi() != null) filterProvinsiByString(root, criteriaBuilder, predicate);
      else getAllProvinsi(root, criteriaBuilder, predicate);
    } else {
      if (filteredProvinsi.getNamaProvinsi() != null)
        filterProvinsiByStringAndKodeWilayah(root, criteriaBuilder, predicate);
      else filterProvinsiByKodeWilayah(root, criteriaBuilder, predicate);
    }
    return predicate;
  }
}