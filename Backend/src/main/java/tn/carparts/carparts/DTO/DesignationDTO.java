package tn.carparts.carparts.DTO;

public record DesignationDTO(
        Long id,
        String name,
        String logo,
        long partCount
) {}