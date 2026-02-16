package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.carparts.carparts.DTO.CarGenerationWithModelDTO;
import tn.carparts.carparts.entity.CarBrand;
import tn.carparts.carparts.entity.CarGeneration;

import java.util.List;

public interface CarGenerationRepository extends JpaRepository<CarGeneration, Long> {
    boolean existsByNameIgnoreCaseAndModelId(String name, Long modelId);

    List<CarGeneration> findByModelBrand(CarBrand brand);

    List<CarGeneration> findByModelId(Long modelId);

    @Query("SELECT g FROM CarGeneration g WHERE lower(g.name) = lower(:name) AND lower(g.model.brand.name) = lower(:brandName)")
    java.util.Optional<CarGeneration> findByNameAndBrandName(String name, String brandName);

    @Query("""
                SELECT new tn.carparts.carparts.DTO.CarGenerationWithModelDTO(
                    g.id,
                    g.name,
                    g.image,
                    m.id,
                    m.name
                )
                FROM CarGeneration g
                JOIN g.model m
            """)
    List<CarGenerationWithModelDTO> findAllWithModelName();

}
