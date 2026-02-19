package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.AccPartDTO;
import tn.carparts.carparts.entity.AccessoryPart;
import tn.carparts.carparts.entity.CategoryAcc;
import tn.carparts.carparts.entity.DesignationPart;
import tn.carparts.carparts.mapper.CarMapper;
import tn.carparts.carparts.repository.AccPartRepository;
import tn.carparts.carparts.repository.CategoryAccRepository;
import tn.carparts.carparts.repository.DesignationPartRepository;

@Service
@RequiredArgsConstructor
public class AccPartService {

    private final AccPartRepository partRepository;
    private final CarMapper mapper;
    private final FileUploadService fileUploadService;
    private final CategoryAccRepository categoryAccRepository;
    private final DesignationPartRepository designationPartRepository;

    @Transactional
    public AccPartDTO createPart(
            Long categoryAccId,
            String name,
            double price,
            double costPrice,
            boolean inStock,
            Long desId,
            String ref,
            String desc,
            boolean onSale,
            int salePercentage,
            MultipartFile imageFile
    ) throws Exception {

        CategoryAcc categoryAcc = categoryAccRepository.findById(categoryAccId)
                .orElseThrow(() -> new RuntimeException("CategoryAcc not found"));

        DesignationPart designationPart = designationPartRepository.findById(desId)
                .orElseThrow(() -> new RuntimeException("DesignationPart not found"));

        AccessoryPart part = new AccessoryPart();
        part.setName(name);
        part.setPrice(price);
        part.setCostPrice(costPrice);
        part.setInStock(inStock);
        part.setReference(ref);
        part.setDescription(desc);
        part.setCategoryAcc(categoryAcc);
        part.setDesignationPart(designationPart);
        part.setOnSale(onSale);
        part.setSalePercentage(salePercentage);
        part.calculateSalePrice();

        if (imageFile != null && !imageFile.isEmpty()) {
            part.setImage(fileUploadService.upload(imageFile, "accessory-parts"));
        }

        return mapper.toAccessoryPartDTO(partRepository.save(part));
    }

    @Transactional
    public AccPartDTO updatePart(
            Long id,
            String name,
            double price,
            double costPrice,
            boolean inStock,
            Long categoryAccId,
            Long desId,
            String ref,
            String desc,
            boolean onSale,
            int salePercentage,
            MultipartFile imageFile
    ) throws Exception {

        AccessoryPart part = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AccessoryPart not found"));

        part.setName(name);
        part.setPrice(price);
        part.setCostPrice(costPrice);
        part.setInStock(inStock);
        part.setReference(ref);
        part.setDescription(desc);
        part.setOnSale(onSale);
        part.setSalePercentage(salePercentage);
        part.calculateSalePrice();

        if (!part.getCategoryAcc().getId().equals(categoryAccId)) {
            CategoryAcc categoryAcc = categoryAccRepository.findById(categoryAccId)
                    .orElseThrow(() -> new RuntimeException("CategoryAcc not found"));
            part.setCategoryAcc(categoryAcc);
        }

        if (!part.getDesignationPart().getId().equals(desId)) {
            DesignationPart designationPart = designationPartRepository.findById(desId)
                    .orElseThrow(() -> new RuntimeException("DesignationPart not found"));
            part.setDesignationPart(designationPart);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            String newImage = fileUploadService.upload(imageFile, "accessory-parts");
            if (part.getImage() != null) {
                fileUploadService.delete(part.getImage());
            }
            part.setImage(newImage);
        }

        return mapper.toAccessoryPartDTO(partRepository.save(part));
    }

    @Transactional
    public Page<AccPartDTO> getPartsByCategoryAcc(Long categoryAccId, Long designationId, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findByCategoryAccIdFiltered(categoryAccId, designationId, pageable)
                .map(mapper::toAccessoryPartDTO);
    }

    @Transactional
    public Page<AccPartDTO> getAllParts(Long designationId, Long categoryAccId, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findAllFiltered(designationId, categoryAccId, pageable)
                .map(mapper::toAccessoryPartDTO);
    }

    @Transactional
    public Page<AccPartDTO> getAllPartsOnSale(int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findAllByOnSaleIsTrue(pageable)
                .map(mapper::toAccessoryPartDTO);
    }

    @Transactional
    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }

    @Transactional
    public AccPartDTO getPartById(Long id) {
        AccessoryPart part = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AccessoryPart not found"));
        return mapper.toAccessoryPartDTO(part);
    }

    @Transactional
    public Page<AccPartDTO> searchParts(String query, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.searchParts(query, pageable)
                .map(mapper::toAccessoryPartDTO);
    }
}