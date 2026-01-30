package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.carparts.carparts.entity.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.carparts.carparts.enums.Role;


public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationToken(String token);


    @Query("""
        SELECT u.id FROM User u 
        WHERE (:role IS NULL OR u.role = :role)
        ORDER BY u.id DESC
    """)
    Page<Long> findUserIdsByRole(@Param("role") Role role, Pageable pageable);


    @Query("SELECT u FROM User u WHERE u.id IN :ids")
    List<User> findUsersByIds(@Param("ids") List<Long> ids);
}