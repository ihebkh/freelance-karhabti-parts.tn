package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.carparts.carparts.entity.CarBrand;

import java.util.Optional;

public interface CarBrandRepository extends JpaRepository<CarBrand, Long> {
    boolean existsByNameIgnoreCase(String name);


    Optional<CarBrand> findByName(String name);
}
