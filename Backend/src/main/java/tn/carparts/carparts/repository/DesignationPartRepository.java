package tn.carparts.carparts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.carparts.carparts.entity.DesignationPart;
import tn.carparts.carparts.DTO.DesignationPartDTO;

import java.util.List;
import java.util.Optional;

public interface DesignationPartRepository extends JpaRepository<DesignationPart, Long> {

    boolean existsByNamePartIgnoreCase(String namePart);

    @Query("""
            select new tn.carparts.carparts.DTO.DesignationPartDTO(
                dp.id,
                dp.namePart,
                dp.logo,
                count(ap)
            )
            from DesignationPart dp
            left join dp.accessoryParts ap
            group by dp.id, dp.namePart, dp.logo
            """)
    List<DesignationPartDTO> findAllWithPartCount();

    @Query("""
            select new tn.carparts.carparts.DTO.DesignationPartDTO(
                dp.id,
                dp.namePart,
                dp.logo,
                count(ap)
            )
            from DesignationPart dp
            left join dp.accessoryParts ap
            where dp.id = :id
            group by dp.id, dp.namePart, dp.logo
            """)
    Optional<DesignationPartDTO> findDtoByIdWithPartCount(Long id);

}