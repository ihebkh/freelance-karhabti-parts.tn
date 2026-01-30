package tn.carparts.carparts.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CarPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;


    private boolean inStock;
    private String image;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "part_compatibility",
            joinColumns = @JoinColumn(name = "part_id"),
            inverseJoinColumns = @JoinColumn(name = "generation_id")
    )
    private List<CarGeneration> compatibleGenerations = new ArrayList<>();


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subcategory_id", nullable = false)
    private SubCategory subCategory;


    private String reference; // e.g., "BOSCH-9921-X"

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "designation_id")
    private Designation designation;



    private boolean onSale;
    private int salePercentage;
    private double priceAfterSale;




    public void calculateSalePrice() {
        if (this.onSale && this.salePercentage > 0) {
            double discount = this.price * (this.salePercentage / 100.0);

            this.priceAfterSale = Math.round((this.price - discount) * 100.0) / 100.0;
        } else {
            this.priceAfterSale = this.price;
        }
    }
}
