package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.MasterRw;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class MasterRwSpecification implements Specification<MasterRw> {
  private final MasterRw filteredRw;

  public MasterRwSpecification(MasterRw filteredRw) {
    this.filteredRw = filteredRw;
  }

  private Predicate buildAllRw(Root<MasterRw> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeRw"), "%");
  }

  private Predicate buildFilterRwByString(Root<MasterRw> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("namaKetuaRw")), "%" + filteredRw.getNamaKetuaRw().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noHpRw")), "%" + filteredRw.getNoHpRw().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noTelpRw")), "%" + filteredRw.getNoTelpRw().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noTelpRwAlt")), "%" + filteredRw.getNoTelpRwAlt().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterRwByKelurahan(Root<MasterRw> root, CriteriaBuilder cb) {
    return cb.equal(root.get("kelurahan").get("kodeKelurahan"), filteredRw.getKelurahan().getKodeKelurahan());
  }

  private Predicate buildFilterByPrincipal(Root<MasterRw> root, CriteriaBuilder cb) {
    return cb.like(root.get("kelurahan").get("kodeKelurahan"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAllRw(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllRw(root, cb));
  }

  private void filterRwByString(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterRwByString(root, cb));
  }

  private void filterRwByKelurahan(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterRwByKelurahan(root, cb));
  }

  private void filterRwByPrincipal(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterRwByStringAndKelurahan(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRwByString(root, cb),
        buildFilterRwByKelurahan(root, cb)
    ));
  }

  private void filterRwByStringAndByPrincipal(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRwByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterRwByKelurahanAndByPrincipal(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRwByKelurahan(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterRwByStringAndKelurahanAndByPrincipal(Root<MasterRw> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRwByString(root, cb),
        buildFilterRwByKelurahan(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<MasterRw> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredRw.getKelurahan() != null && filteredRw.getKelurahan().getKodeKelurahan() != null) {
        if (filteredRw.getNamaKetuaRw() != null) filterRwByStringAndKelurahan(root, cb, predicate);
        else filterRwByKelurahan(root, cb, predicate);
      } else {
        if (filteredRw.getNamaKetuaRw() != null) filterRwByString(root, cb, predicate);
        else getAllRw(root, cb, predicate);
      }
    } else {
      if (filteredRw.getKelurahan() != null && filteredRw.getKelurahan().getKodeKelurahan() != null) {
        if (filteredRw.getNamaKetuaRw() != null)
          filterRwByStringAndKelurahanAndByPrincipal(root, cb, predicate);
        else filterRwByKelurahanAndByPrincipal(root, cb, predicate);
      } else {
        if (filteredRw.getNamaKetuaRw() != null) filterRwByStringAndByPrincipal(root, cb, predicate);
        else filterRwByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}