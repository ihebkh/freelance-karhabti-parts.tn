package tn.carparts.carparts.DTO;

public record CarModelDTO(
        Long id,
        String name,
        String image,
        Long brandId
) {}