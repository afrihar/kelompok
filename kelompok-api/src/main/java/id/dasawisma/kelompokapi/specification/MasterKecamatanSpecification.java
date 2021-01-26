package id.dasawisma.kelompokapi.specification;

import id.dasawisma.kelompokapi.model.MasterKecamatan;
import id.dasawisma.kelompokapi.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class MasterKecamatanSpecification implements Specification<MasterKecamatan> {
  private final MasterKecamatan filteredKecamatan;

  public MasterKecamatanSpecification(MasterKecamatan filteredKecamatan) {
    this.filteredKecamatan = filteredKecamatan;
  }

  private Predicate buildAllKecamatan(Root<MasterKecamatan> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeKecamatan"), "%");
  }

  private Predicate buildFilterKecamatanByString(Root<MasterKecamatan> root, CriteriaBuilder cb) {
    return cb.like(cb.lower(root.get("namaKecamatan")), "%" + filteredKecamatan.getNamaKecamatan().toLowerCase() + "%");
  }

  private Predicate buildFilterKecamatanByKota(Root<MasterKecamatan> root, CriteriaBuilder cb) {
    return cb.equal(root.get("kota").get("kodeKota"), filteredKecamatan.getKota().getKodeKota());
  }

  private Predicate buildFilterByPrincipal(Root<MasterKecamatan> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeKecamatan"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAllKecamatan(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllKecamatan(root, cb));
  }

  private void filterKecamatanByString(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKecamatanByString(root, cb));
  }

  private void filterKecamatanByKota(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKecamatanByKota(root, cb));
  }

  private void filterKecamatanByPrincipal(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterKecamatanByStringAndKota(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKecamatanByString(root, cb),
        buildFilterKecamatanByKota(root, cb)
    ));
  }

  private void filterKecamatanByStringAndByPrincipal(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKecamatanByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterKecamatanByKotaAndByPrincipal(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKecamatanByKota(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterKecamatanByStringAndKotaAndByPrincipal(Root<MasterKecamatan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKecamatanByString(root, cb),
        buildFilterKecamatanByKota(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<MasterKecamatan> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredKecamatan.getKota() != null && filteredKecamatan.getKota().getKodeKota() != null) {
        if (filteredKecamatan.getNamaKecamatan() != null) filterKecamatanByStringAndKota(root, cb, predicate);
        else filterKecamatanByKota(root, cb, predicate);
      } else {
        if (filteredKecamatan.getNamaKecamatan() != null) filterKecamatanByString(root, cb, predicate);
        else getAllKecamatan(root, cb, predicate);
      }
    } else {
      if (filteredKecamatan.getKota() != null && filteredKecamatan.getKota().getKodeKota() != null) {
        if (filteredKecamatan.getNamaKecamatan() != null)
          filterKecamatanByStringAndKotaAndByPrincipal(root, cb, predicate);
        else filterKecamatanByKotaAndByPrincipal(root, cb, predicate);
      } else {
        if (filteredKecamatan.getNamaKecamatan() != null) filterKecamatanByStringAndByPrincipal(root, cb, predicate);
        else filterKecamatanByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}