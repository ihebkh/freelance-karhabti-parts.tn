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
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = "nameAcc")
)
public class CategoryAcc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nameAcc;

    private String imageAcc;

  //  @OneToMany(mappedBy = "categoryAcc", cascade = CascadeType.ALL, orphanRemoval = true)
   // private List<SubCategoryAcc> subCategoriesAcc = new ArrayList<>();
}