package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.carparts.carparts.entity.Designation;

public interface DesignationRepository extends JpaRepository<Designation, Long> {

    boolean existsByNameIgnoreCase(String name);

}
