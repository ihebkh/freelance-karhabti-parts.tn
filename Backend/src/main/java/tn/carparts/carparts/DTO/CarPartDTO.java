package tn.carparts.carparts.DTO;

import java.util.List;

public record CarPartDTO(
        Long id,
        String name,
        double price,
        boolean inStock,
        String image,
        List<CarGenerationDTO> compatibility,
        Long subCategoryId,
        String subCategoryName,
        Long categoryId,
        String categoryName,
        //
        String reference,
        String description,
        Long designationId,
        String designationName,


        boolean onSale,
        int salePercentage,
        double priceAfterSale
) {}