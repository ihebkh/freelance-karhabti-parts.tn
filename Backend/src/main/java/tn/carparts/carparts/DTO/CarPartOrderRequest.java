package tn.carparts.carparts.DTO;

import java.util.List;

public record CarPartOrderRequest(
        String deliveryAddress,
        List<OrderItemRequest> items
) {}