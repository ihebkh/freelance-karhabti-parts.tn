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
public class AccessoryPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;
    private double costPrice;

    private boolean inStock;
    private String image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryacc_id", nullable = false)
    private CategoryAcc categoryAcc;

    private String reference;

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