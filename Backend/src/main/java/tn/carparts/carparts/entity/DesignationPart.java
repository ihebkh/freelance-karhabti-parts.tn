package tn.carparts.carparts.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "designationsPart")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DesignationPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String namePart;

    private String logo;

    @OneToMany(mappedBy = "designationPart", fetch = FetchType.LAZY) // ← P majuscule
    private List<AccessoryPart> accessoryParts = new ArrayList<>();
}