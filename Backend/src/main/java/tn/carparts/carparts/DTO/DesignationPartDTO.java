package tn.carparts.carparts.DTO;

public record DesignationPartDTO(
        Long id,
        String namePart,
        String logo,
        long partCount
) {}