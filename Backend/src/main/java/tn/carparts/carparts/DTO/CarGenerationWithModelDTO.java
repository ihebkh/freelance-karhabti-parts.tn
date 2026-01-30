package tn.carparts.carparts.DTO;

public record CarGenerationWithModelDTO(
        Long id,
        String name,
        String image,
        Long modelId,
        String modelName
) {}
