package tn.carparts.carparts.DTO;

import java.util.List;

public record CategoryDTO(
        Long id,
        String name,
        String image,
        List<SubCategoryDTO> subCategories // Nested list for hierarchical views
) {}