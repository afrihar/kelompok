package id.dasawisma.kelompok.specification;

import id.dasawisma.kelompok.model.MasterRt;
import id.dasawisma.kelompok.util.PrincipalUtil;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

public class MasterRtSpecification implements Specification<MasterRt> {
  private final MasterRt filteredRt;

  public MasterRtSpecification(MasterRt filteredRt) {
    this.filteredRt = filteredRt;
  }

  private Predicate buildAllRt(Root<MasterRt> root, CriteriaBuilder cb) {
    return cb.like(root.get("kodeRt"), "%");
  }

  private Predicate buildFilterRtByString(Root<MasterRt> root, CriteriaBuilder cb) {
    return cb.or(
        cb.like(cb.lower(root.get("namaKetuaRt")), "%" + filteredRt.getNamaKetuaRt().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noHpRt")), "%" + filteredRt.getNoHpRt().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noTelpRt")), "%" + filteredRt.getNoTelpRt().toLowerCase() + "%"),
        cb.like(cb.lower(root.get("noTelpRtAlt")), "%" + filteredRt.getNoTelpRtAlt().toLowerCase() + "%")
    );
  }

  private Predicate buildFilterRtByRw(Root<MasterRt> root, CriteriaBuilder cb) {
    return cb.equal(
        root.get("rw").get("kodeRw"),
        filteredRt.getRw().getKodeRw()
    );
  }

  private Predicate buildFilterByPrincipal(Root<MasterRt> root, CriteriaBuilder cb) {
    return cb.like(root.get("rw").get("kodeRw"), PrincipalUtil.getKodeWilayah() + "%");
  }

  private void getAllRt(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildAllRt(root, cb));
  }

  private void filterRtByString(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterRtByString(root, cb));
  }

  private void filterRtByRw(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterRtByRw(root, cb));
  }

  private void filterRtByPrincipal(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(buildFilterByPrincipal(root, cb));
  }

  private void filterRtByStringAndRw(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRtByString(root, cb),
        buildFilterRtByRw(root, cb)
    ));
  }

  private void filterRtByStringAndByPrincipal(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRtByString(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterRtByRwAndByPrincipal(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRtByRw(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  private void filterRtByStringAndRwAndByPrincipal(Root<MasterRt> root, CriteriaBuilder cb, Predicate predicate) {
    predicate.getExpressions().add(cb.and(
        buildFilterRtByString(root, cb),
        buildFilterRtByRw(root, cb),
        buildFilterByPrincipal(root, cb)
    ));
  }

  @Override
  public Predicate toPredicate(@SuppressWarnings("NullableProblems") Root<MasterRt> root,
                               @SuppressWarnings("NullableProblems") CriteriaQuery<?> criteriaQuery,
                               CriteriaBuilder cb) {
    Predicate predicate = cb.disjunction();
    if (PrincipalUtil.isPusdatin()) {
      if (filteredRt.getRw() != null && filteredRt.getRw().getKodeRw() != null) {
        if (filteredRt.getNamaKetuaRt() != null) filterRtByStringAndRw(root, cb, predicate);
        else filterRtByRw(root, cb, predicate);
      } else {
        if (filteredRt.getNamaKetuaRt() != null) filterRtByString(root, cb, predicate);
        else getAllRt(root, cb, predicate);
      }
    } else {
      if (filteredRt.getRw() != null && filteredRt.getRw().getKodeRw() != null) {
        if (filteredRt.getNamaKetuaRt() != null)
          filterRtByStringAndRwAndByPrincipal(root, cb, predicate);
        else filterRtByRwAndByPrincipal(root, cb, predicate);
      } else {
        if (filteredRt.getNamaKetuaRt() != null) filterRtByStringAndByPrincipal(root, cb, predicate);
        else filterRtByPrincipal(root, cb, predicate);
      }
    }
    return predicate;
  }
}