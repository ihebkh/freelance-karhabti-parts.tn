package tn.carparts.carparts.service;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import tn.carparts.carparts.DTO.CarPartOrderDTO;
import tn.carparts.carparts.DTO.CarPartOrderRequest;
import tn.carparts.carparts.DTO.OrderItemDTO;
import tn.carparts.carparts.entity.CarPartOrder;
import tn.carparts.carparts.entity.CarPartOrderItem;
import tn.carparts.carparts.enums.OrderStatus;
import tn.carparts.carparts.repository.CarPartOrderRepository;
import tn.carparts.carparts.repository.CarPartRepository;
import tn.carparts.carparts.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarPartOrderService {

    private final CarPartOrderRepository orderRepository;
    private final CarPartRepository partRepository;
    private final UserRepository userRepository;

    public CarPartOrderService(CarPartOrderRepository orderRepository,
            CarPartRepository partRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.partRepository = partRepository;
        this.userRepository = userRepository;
    }

    public CarPartOrderDTO createOrder(String email, CarPartOrderRequest request) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var order = new CarPartOrder();
        order.setUser(user);
        order.setWhatsapp(user.getWhatsapp());
        order.setPhone(user.getPhone());
        order.setDeliveryAddress(request.deliveryAddress());
        order.setStatus(OrderStatus.PENDING);

        for (var i : request.items()) {
            var part = partRepository.findById(i.partId())
                    .orElseThrow(() -> new RuntimeException("Part not found"));

            var orderItem = new CarPartOrderItem();
            orderItem.setOrder(order);
            orderItem.setPart(part);
            orderItem.setQuantity(i.quantity());

            // Snapshots ensure data persistence even if the part is deleted later
            orderItem.setPartNameSnapshot(part.getName());
            if (!part.isOnSale()) {
                orderItem.setPriceSnapshot(part.getPrice());
            } else {
                orderItem.setPriceSnapshot(part.getPriceAfterSale());
            }
            orderItem.setCostPriceSnapshot(part.getCostPrice());
            order.getItems().add(orderItem);
        }

        CarPartOrder savedOrder = orderRepository.save(order);

        // Return DTO to prevent JSON nesting depth errors
        return toDTO(savedOrder);
    }

    @Transactional
    public Page<CarPartOrderDTO> getAllOrders(OrderStatus status, int page) {
        // UPDATED: Added sorting here
        Pageable pageable = PageRequest.of(page, 6, Sort.by(Sort.Direction.DESC, "id"));

        Page<Long> orderIdsPage = orderRepository.findOrderIdsByStatus(status, pageable);
        if (orderIdsPage.isEmpty())
            return Page.empty();

        List<CarPartOrder> orders = orderRepository.findOrdersWithItemsByIds(orderIdsPage.getContent());

        // IMPORTANT: Mapping logic must preserve order (explained in step 2)
        List<CarPartOrderDTO> dtos = orders.stream().map(this::toDTO).toList();
        return new PageImpl<>(dtos, pageable, orderIdsPage.getTotalElements());
    }

    @Transactional
    public Page<CarPartOrderDTO> getOrdersByUser(String userEmail, OrderStatus status, int page) {
        // UPDATED: Added sorting here
        Pageable pageable = PageRequest.of(page, 6, Sort.by(Sort.Direction.DESC, "id"));

        Page<Long> orderIdsPage = orderRepository.findOrderIdsByUserAndStatus(userEmail, status, pageable);
        if (orderIdsPage.isEmpty())
            return Page.empty();

        List<CarPartOrder> orders = orderRepository.findOrdersWithItemsByIds(orderIdsPage.getContent());
        List<CarPartOrderDTO> dtos = orders.stream().map(this::toDTO).toList();
        return new PageImpl<>(dtos, pageable, orderIdsPage.getTotalElements());
    }

    public CarPartOrderDTO updateStatus(Long orderId, OrderStatus status) {
        CarPartOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        orderRepository.save(order);

        CarPartOrder fullOrder = orderRepository.findAllWithItems()
                .stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow();

        return toDTO(fullOrder);
    }

    private CarPartOrderDTO toDTO(CarPartOrder order) {
        var itemsDTO = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getPart() != null ? item.getPart().getId() : null, // partId
                        item.getPartNameSnapshot(),
                        item.getPriceSnapshot(),
                        item.getCostPriceSnapshot(),
                        item.getQuantity(),
                        item.getPriceSnapshot() * item.getQuantity()))
                .toList();

        double totalSelling = itemsDTO.stream().mapToDouble(OrderItemDTO::subTotal).sum();
        double totalCost = order.getItems().stream()
                .mapToDouble(item -> item.getCostPriceSnapshot() * item.getQuantity())
                .sum();
        double totalMargin = totalSelling - totalCost;

        return new CarPartOrderDTO(
                order.getId(),
                order.getUser().getEmail(),
                order.getWhatsapp(),
                order.getPhone(),
                order.getDeliveryAddress(),
                order.getDateDelivery(),
                order.getStatus(),
                itemsDTO,
                totalCost,
                totalMargin);
    }
}
