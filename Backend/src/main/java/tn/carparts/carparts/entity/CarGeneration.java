package tn.carparts.carparts.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "car_generations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"name", "model_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarGeneration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", nullable = false)
    private CarModel model;


    @ManyToMany(mappedBy = "compatibleGenerations", cascade = CascadeType.ALL)
    private List<CarPart> parts = new ArrayList<>();

}
