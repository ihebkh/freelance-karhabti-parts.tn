package tn.carparts.carparts.mapper;

import org.springframework.stereotype.Component;
import tn.carparts.carparts.DTO.*;
import tn.carparts.carparts.entity.*;

import java.util.List;

@Component
public class CarMapper {

        public CarBrandDTO toBrandDTO(CarBrand brand) {
                return new CarBrandDTO(
                                brand.getId(),
                                brand.getName(),
                                brand.getLogo());
        }

        public CarModelDTO toModelDTO(CarModel model) {
                return new CarModelDTO(
                                model.getId(),
                                model.getName(),
                                model.getImage(),
                                model.getBrand().getId());
        }

        public CarGenerationDTO toGenerationDTO(CarGeneration generation) {
                return new CarGenerationDTO(
                                generation.getId(),
                                generation.getName(),
                                generation.getImage(),
                                generation.getModel().getId());
        }

        public CarPartDTO toPartDTO(CarPart part) {
                java.util.List<CarGenerationDTO> compatibilityList = part.getCompatibleGenerations().stream()
                                .map(gen -> new CarGenerationDTO(
                                                gen.getId(),
                                                gen.getName(),
                                                gen.getImage(),
                                                gen.getModel() != null ? gen.getModel().getId() : null))
                                .collect(java.util.stream.Collectors.toList());

                return new CarPartDTO(
                                part.getId(),
                                part.getName(),
                                part.getPrice(),
                                part.getCostPrice(),
                                part.isInStock(),
                                part.getImage(),
                                compatibilityList,

                                // SubCategory Info
                                part.getSubCategory() != null ? part.getSubCategory().getId() : null,
                                part.getSubCategory() != null ? part.getSubCategory().getName() : null,

                                // Category Info
                                (part.getSubCategory() != null && part.getSubCategory().getCategory() != null)
                                                ? part.getSubCategory().getCategory().getId()
                                                : null,
                                (part.getSubCategory() != null && part.getSubCategory().getCategory() != null)
                                                ? part.getSubCategory().getCategory().getName()
                                                : null,
                                part.getReference(),
                                part.getDescription(),
                                part.getDesignation().getId(),
                                part.getDesignation().getName(),
                                part.isOnSale(),
                                part.getSalePercentage(),
                                part.getPriceAfterSale());
        }

        public OrderItemDTO toOrderItemDTO(CarPartOrderItem item) {
                return new OrderItemDTO(
                                item.getId(),
                                item.getPart() != null ? item.getPart().getId() : null, // ID might be null if deleted
                                item.getPartNameSnapshot(), // Use the snapshot!
                                item.getPriceSnapshot(), // Use the snapshot!
                                item.getQuantity(),
                                item.getPriceSnapshot() * item.getQuantity() // Calculate subtotal
                );
        }

        public CarPartOrderDTO toOrderDTO(CarPartOrder order) {
                List<OrderItemDTO> itemDTOs = order.getItems().stream()
                                .map(this::toOrderItemDTO)
                                .toList();

                return new CarPartOrderDTO(
                                order.getId(),
                                order.getUser().getEmail(),
                                order.getWhatsapp(),
                                order.getPhone(),
                                order.getDeliveryAddress(),
                                order.getDateDelivery(),
                                order.getStatus(),
                                itemDTOs);
        }

        public DesignationDTO toDesignationDTO(Designation designation) {
                if (designation == null)
                        return null;
                return new DesignationDTO(
                                designation.getId(),
                                designation.getName(),
                                designation.getLogo(),
                                designation.getParts().size());
        }
}