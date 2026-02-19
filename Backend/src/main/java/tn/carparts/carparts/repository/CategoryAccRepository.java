package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.carparts.carparts.entity.CategoryAcc;

import java.util.List;

public interface CategoryAccRepository extends JpaRepository<CategoryAcc, Long> {
    boolean existsByName(String name);
}