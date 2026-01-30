package tn.carparts.carparts.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.carparts.carparts.entity.CarPartOrder;
import org.springframework.data.domain.Pageable;
import tn.carparts.carparts.enums.OrderStatus;

import java.util.List;

public interface CarPartOrderRepository extends JpaRepository<CarPartOrder, Long> {

    // REPLACES: findOrderIdsByUserEmail
    @Query("""
        SELECT o.id FROM CarPartOrder o 
        WHERE o.user.email = :email 
        AND (:status IS NULL OR o.status = :status)
    """)
    Page<Long> findOrderIdsByUserAndStatus(
            @Param("email") String email,
            @Param("status") OrderStatus status,
            Pageable pageable
    );

    // REPLACES: findAllOrderIds
    @Query("""
        SELECT o.id FROM CarPartOrder o 
        WHERE (:status IS NULL OR o.status = :status)
    """)
    Page<Long> findOrderIdsByStatus(@Param("status") OrderStatus status, Pageable pageable);

    // KEEP THIS EXACTLY AS IS
    @Query("""
        SELECT DISTINCT o
        FROM CarPartOrder o
        LEFT JOIN FETCH o.items i
        LEFT JOIN FETCH i.part
        LEFT JOIN FETCH o.user
        WHERE o.id IN :ids
        ORDER BY o.id DESC
    """)
    List<CarPartOrder> findOrdersWithItemsByIds(@Param("ids") List<Long> ids);


    @Query("""
        SELECT DISTINCT o
        FROM CarPartOrder o
        JOIN FETCH o.items i
        JOIN FETCH i.part
        JOIN FETCH o.user
    """)
    List<CarPartOrder> findAllWithItems();

}