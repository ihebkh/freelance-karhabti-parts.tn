package tn.carparts.carparts.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.carparts.carparts.DTO.CarPartOrderDTO;
import tn.carparts.carparts.DTO.CarPartOrderRequest;
import tn.carparts.carparts.entity.CarPartOrder;
import tn.carparts.carparts.enums.OrderStatus;
import tn.carparts.carparts.service.CarPartOrderService;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class CarPartOrderController {

    private final CarPartOrderService orderService;

    public CarPartOrderController(CarPartOrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public CarPartOrderDTO createOrder(@RequestParam String email, @RequestBody CarPartOrderRequest request) {
        return orderService.createOrder(email, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public Page<CarPartOrderDTO> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page
    ) {

        return orderService.getAllOrders(status, page);
    }

    @GetMapping("/user/{userEmail}")
    @PreAuthorize("hasRole('USER')")
    public Page<CarPartOrderDTO> getOrdersByUser(
            @PathVariable String userEmail,
            @RequestParam(required = false) OrderStatus status, // New parameter
            @RequestParam(defaultValue = "0") int page
    ) {
        // Pass both email, status, and page to the service
        return orderService.getOrdersByUser(userEmail, status, page);
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public CarPartOrderDTO updateStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        return orderService.updateStatus(orderId, status);
    }


}
