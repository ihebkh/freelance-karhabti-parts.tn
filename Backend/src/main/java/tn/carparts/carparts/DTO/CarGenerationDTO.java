package tn.carparts.carparts.DTO;

public record CarGenerationDTO(
        Long id,
        String name,
        String image,
        Long modelId
) {}