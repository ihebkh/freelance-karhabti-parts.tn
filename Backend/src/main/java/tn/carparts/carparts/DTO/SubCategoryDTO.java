package tn.carparts.carparts.DTO;

public record SubCategoryDTO(
        Long id,
        String name,
        String image,
        Long categoryId,
        String categoryName
) {}
