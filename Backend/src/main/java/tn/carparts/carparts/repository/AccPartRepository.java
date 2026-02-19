package tn.carparts.carparts.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.carparts.carparts.entity.AccessoryPart;

public interface AccPartRepository extends JpaRepository<AccessoryPart, Long> {

    Page<AccessoryPart> findByCategoryAccId(Long categoryAccId, Pageable pageable);

    @Query("SELECT p FROM AccessoryPart p " +
            "WHERE p.categoryAcc.id = :catId " +
            "AND (:desId IS NULL OR p.designationPart.id = :desId)")
    Page<AccessoryPart> findByCategoryAccIdFiltered(
            @Param("catId") Long catId,
            @Param("desId") Long desId,
            Pageable pageable);

    @Query("SELECT p FROM AccessoryPart p WHERE " +
            "(:desId IS NULL OR p.designationPart.id = :desId) " +
            "AND (:catId IS NULL OR p.categoryAcc.id = :catId)")
    Page<AccessoryPart> findAllFiltered(
            @Param("desId") Long desId,
            @Param("catId") Long catId,
            Pageable pageable);

    Page<AccessoryPart> findAllByOnSaleIsTrue(Pageable pageable);

    @Query("""
        SELECT DISTINCT p FROM AccessoryPart p
        LEFT JOIN p.categoryAcc c
        LEFT JOIN p.designationPart d
        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(d.namePart) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.reference) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    Page<AccessoryPart> searchParts(@Param("query") String query, Pageable pageable);
}