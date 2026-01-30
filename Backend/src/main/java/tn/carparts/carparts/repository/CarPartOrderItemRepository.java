package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.carparts.carparts.entity.CarPartOrderItem;

public interface CarPartOrderItemRepository extends JpaRepository<CarPartOrderItem, Long> {}
