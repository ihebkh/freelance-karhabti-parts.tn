package tn.carparts.carparts.DTO;

public record OrderItemDTO(
        Long id,
        Long partId,         // Might be null if part was deleted
        String partName,     // Map from partNameSnapshot
        double partPrice,    // Map from priceSnapshot
        double costPrice,   // Map from costPriceSnapshot (prix d'achat unitaire)
        int quantity,
        double subTotal      // Helpful for the frontend: price * quantity
) {}