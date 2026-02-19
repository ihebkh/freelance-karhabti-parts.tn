package tn.carparts.carparts.DTO;

public record AccPartDTO(
        Long id,
        String name,
        double price,
        double costPrice,
        boolean inStock,
        String image,
        Long categoryAccId,
        String categoryAccName,
        String reference,
        String description,
        Long designationId,
        String designationName,
        boolean onSale,
        int salePercentage,
        double priceAfterSale
) {}
