package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.MasterKelurahan;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class MasterKelurahanSpecification implements Specification<MasterKelurahan> {
  private final MasterKelurahan filteredKelurahan;

  public MasterKelurahanSpecification(MasterKelurahan filteredKelurahan) {
    this.filteredKelurahan = filteredKelurahan;
  }

  private Predicate buildAllKelurahan(Root<MasterKelurahan> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeKelurahan"), "%");
  }

  private Predicate buildFilterKelurahanByString(Root<MasterKelurahan> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("namaKelurahan")), "%" + filteredKelurahan.getNamaKelurahan().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("namaKelompokKelurahan")), "%" + filteredKelurahan.getNamaKelompokKelurahan().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterKelurahanByKecamatan(Root<MasterKelurahan> root, CriteriaBuilder cb) {
    return cb.equal(root.get("kecamatan").get("kodeKecamatan"), filteredKelurahan.getKecamatan().getKodeKecamatan());
  }

  private Predicate buildFilterByPrincipal(Root<MasterKelurahan> root, CriteriaBuilder cb) {
    return cb.like(root.get("kecamatan").get("kodeKecamatan"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAllKelurahan(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllKelurahan(root, cb));
  }

  private void filterKelurahanByString(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKelurahanByString(root, cb));
  }

  private void filterKelurahanByKecamatan(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterKelurahanByKecamatan(root, cb));
  }

  private void filterKelurahanByPrincipal(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterKelurahanByStringAndKecamatan(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKelurahanByString(root, cb),
        buildFilterKelurahanByKecamatan(root, cb)
    ));
  }

  private void filterKelurahanByStringAndByPrincipal(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKelurahanByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterKelurahanByKecamatanAndByPrincipal(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKelurahanByKecamatan(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterKelurahanByStringAndKecamatanAndByPrincipal(Root<MasterKelurahan> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterKelurahanByString(root, cb),
        buildFilterKelurahanByKecamatan(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<MasterKelurahan> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredKelurahan.getKecamatan() != null && filteredKelurahan.getKecamatan().getKodeKecamatan() != null) {
        if (filteredKelurahan.getNamaKelurahan() != null) filterKelurahanByStringAndKecamatan(root, cb, predicate);
        else filterKelurahanByKecamatan(root, cb, predicate);
      } else {
        if (filteredKelurahan.getNamaKelurahan() != null) filterKelurahanByString(root, cb, predicate);
        else getAllKelurahan(root, cb, predicate);
      }
    } else {
      if (filteredKelurahan.getKecamatan() != null && filteredKelurahan.getKecamatan().getKodeKecamatan() != null) {
        if (filteredKelurahan.getNamaKelurahan() != null)
          filterKelurahanByStringAndKecamatanAndByPrincipal(root, cb, predicate);
        else filterKelurahanByKecamatanAndByPrincipal(root, cb, predicate);
      } else {
        if (filteredKelurahan.getNamaKelurahan() != null) filterKelurahanByStringAndByPrincipal(root, cb, predicate);
        else filterKelurahanByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}