package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.MasterKota;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class MasterKotaSpecification implements Specification<MasterKota> {
  private final MasterKota filteredKota;

  public MasterKotaSpecification(MasterKota filteredKota) {
    this.filteredKota = filteredKota;
  }

  private Predicate buildAllKota(Root<MasterKota> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeKota"), "%");
  }

  private Predicate buildFilterKotaByString(Root<MasterKota> root, CriteriaBuilder cb) {
    return cb.like(cb.lower(root.get("namaKota")), "%" + filteredKota.getNamaKota().toLowerCase() + "%");
  }

  private Predicate buildFilterKotaByProvinsi(Root<MasterKota> root, CriteriaBuilder cb) {
    return cb.equal(root.get("provinsi").get("kodeProvinsi"), filteredKota.getProvinsi().getKodeProvinsi());
  }

  private Predicate buildFilterByPrincipal(Root<MasterKota> root, CriteriaBuilder cb) {
    return cb.equal(root.get("provinsi").get("kodeProvinsi"), PrincipalUtil.getKodeProvinsi());
  }

  private void getAllKota(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllKota(root, cb));
  }

  private void filterKotaByString(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKotaByString(root, cb));
  }

  private void filterKotaByProvinsi(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKotaByProvinsi(root, cb));
  }

  private void filterKotaByPrincipal(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterKotaByStringAndProvinsi(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKotaByString(root, cb),
        buildFilterKotaByProvinsi(root, cb)
    ));
  }

  private void filterKotaByStringAndByPrincipal(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKotaByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterKotaByProvinsiAndByPrincipal(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKotaByProvinsi(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterKotaByStringAndProvinsiAndByPrincipal(Root<MasterKota> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKotaByString(root, cb),
        buildFilterKotaByProvinsi(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<MasterKota> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredKota.getProvinsi() != null && filteredKota.getProvinsi().getKodeProvinsi() != null) {
        if (filteredKota.getNamaKota() != null) filterKotaByStringAndProvinsi(root, cb, predicate);
        else filterKotaByProvinsi(root, cb, predicate);
      } else {
        if (filteredKota.getNamaKota() != null) filterKotaByString(root, cb, predicate);
        else getAllKota(root, cb, predicate);
      }
    } else {
      if (filteredKota.getProvinsi() != null && filteredKota.getProvinsi().getKodeProvinsi() != null) {
        if (filteredKota.getNamaKota() != null) filterKotaByStringAndProvinsiAndByPrincipal(root, cb, predicate);
        else filterKotaByProvinsiAndByPrincipal(root, cb, predicate);
      } else {
        if (filteredKota.getNamaKota() != null) filterKotaByStringAndByPrincipal(root, cb, predicate);
        else filterKotaByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}