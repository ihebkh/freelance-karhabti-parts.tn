package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.carparts.carparts.entity.CarBrand;
import tn.carparts.carparts.entity.CarModel;

import java.util.List;
import java.util.Optional;

public interface CarModelRepository extends JpaRepository<CarModel, Long> {
    boolean existsByNameIgnoreCaseAndBrandId(String name, Long brandId);

    List<CarModel> findByBrandId(Long brandId);

    List<CarModel> findByBrand(CarBrand brand);

    Optional<CarModel> findByName(String name);
}
