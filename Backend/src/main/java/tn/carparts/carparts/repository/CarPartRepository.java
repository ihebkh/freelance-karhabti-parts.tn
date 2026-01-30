package tn.carparts.carparts.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.carparts.carparts.entity.CarPart;

public interface CarPartRepository extends JpaRepository<CarPart, Long> {

    // Use 'Member Of' or join the collection to find parts by a specific generation ID
    @Query("SELECT p FROM CarPart p JOIN p.compatibleGenerations g WHERE g.id = :generationId")
    Page<CarPart> findByGenerationId(@Param("generationId") Long generationId, Pageable pageable);

    Page<CarPart> findBySubCategoryId(Long subCategoryId, Pageable pageable);





    // CarPartRepository.java

    @Query("SELECT p FROM CarPart p JOIN p.compatibleGenerations g " +
            "WHERE g.id = :genId " +
            "AND (:desId IS NULL OR p.designation.id = :desId)"+
            "AND (:catId IS NULL OR p.subCategory.category.id = :catId)"+
            "AND (:subCatId IS NULL OR p.subCategory.id = :subCatId)"
    )
    Page<CarPart> findByGenerationIdFiltered(
            @Param("genId") Long genId,
            @Param("desId") Long desId,
            @Param("catId") Long catId,
            @Param("subCatId") Long subCatId,
            Pageable pageable);

    @Query("SELECT p FROM CarPart p " +
            "WHERE p.subCategory.id = :subId AND (:desId IS NULL OR p.designation.id = :desId)")
    Page<CarPart> findBySubCategoryIdFiltered(
            @Param("subId") Long subId,
            @Param("desId") Long desId,
            Pageable pageable);

    @Query("SELECT p FROM CarPart p WHERE " +
            "(:desId IS NULL OR p.designation.id = :desId)"+
            "AND (:catId IS NULL OR p.subCategory.category.id = :catId)"+
            "AND (:subCatId IS NULL OR p.subCategory.id = :subCatId)"
    )
    Page<CarPart> findAllFiltered(
            @Param("desId") Long desId,
            @Param("catId") Long catId,
            @Param("subCatId") Long subCatId,
            Pageable pageable);


    Page<CarPart> findAllByOnSaleIsTrue(Pageable pageable);




    @Query("""
        SELECT DISTINCT p FROM CarPart p
        LEFT JOIN p.compatibleGenerations g
        LEFT JOIN g.model m
        LEFT JOIN m.brand b
        WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.subCategory.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(p.subCategory.category.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    Page<CarPart> searchParts(@Param("query") String query, Pageable pageable);
}