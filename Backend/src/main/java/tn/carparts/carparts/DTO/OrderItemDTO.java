package tn.carparts.carparts.DTO;

public record OrderItemDTO(
        Long id,
        Long partId,         // Might be null if part was deleted
        String partName,     // Map from partNameSnapshot
        double partPrice,    // Map from priceSnapshot
        int quantity,
        double subTotal      // Helpful for the frontend: price * quantity
) {}