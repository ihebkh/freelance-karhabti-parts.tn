package tn.carparts.carparts.DTO;

import tn.carparts.carparts.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record CarPartOrderDTO(
                Long id,
                String userEmail,
                String whatsapp,
                String phone,
                String deliveryAddress,
                LocalDateTime dateDelivery,
                OrderStatus status,
                List<OrderItemDTO> items,
                Double totalCostPrice,  // Prix d'achat total de la commande
                Double totalMargin) {   // Différence: montant total vente - prix d'achat total
}