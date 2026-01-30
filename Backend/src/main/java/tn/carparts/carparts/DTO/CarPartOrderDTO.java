package tn.carparts.carparts.DTO;

import tn.carparts.carparts.enums.OrderStatus;

import java.util.List;

public record CarPartOrderDTO(
        Long id,
        String userEmail,
        String whatsapp,
        String phone,
        String deliveryAddress,
        OrderStatus status,
        List<OrderItemDTO> items
) {}