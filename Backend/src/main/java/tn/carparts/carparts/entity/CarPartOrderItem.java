package tn.carparts.carparts.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CarPartOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private CarPartOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = true)
    @OnDelete(action = OnDeleteAction.SET_NULL) // This is the key
    private CarPart part;

    private int quantity;
    private String partNameSnapshot; // Name at time of purchase
    private double priceSnapshot;     // Price at time of purchase

    @Column(columnDefinition = "double default 0")
    private double costPriceSnapshot; // Cost price at time of purchase (prix d'achat unitaire)

}
