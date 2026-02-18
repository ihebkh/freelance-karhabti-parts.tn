package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
import tn.carparts.carparts.entity.CategoryAcc;

import java.util.List;

public interface CategoryAccRepository extends JpaRepository<CategoryAcc, Long> {
    boolean existsByNameAcc(String nameAcc);
    // @Query("SELECT DISTINCT c FROM CategoryAcc c LEFT JOIN FETCH c.subCategoriesAcc")
    // List<CategoryAcc> findAllWithSubCategoriesAcc();
}