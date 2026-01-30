package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CarPartDTO;
import tn.carparts.carparts.entity.CarGeneration;
import tn.carparts.carparts.entity.CarPart;
import tn.carparts.carparts.entity.Designation;
import tn.carparts.carparts.entity.SubCategory;
import tn.carparts.carparts.mapper.CarMapper;
import tn.carparts.carparts.repository.CarGenerationRepository;
import tn.carparts.carparts.repository.CarPartRepository;
import tn.carparts.carparts.repository.DesignationRepository;
import tn.carparts.carparts.repository.SubCategoryRepository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
@Service
@RequiredArgsConstructor
public class CarPartService {

    private final CarPartRepository partRepository;
    private final CarGenerationRepository generationRepository;
    private final CarMapper mapper;
    private final FileUploadService fileUploadService;
    private final SubCategoryRepository subCategoryRepository;
    private final DesignationRepository designationRepository;

    @Transactional
    public CarPartDTO createPart(
            List<Long> generationIds,
            Long subCategoryId,
            String name,
            double price,
            boolean inStock,
            Long desId,
            String ref,
            String desc,
            boolean onSale,
            int salePercentage,
            MultipartFile imageFile
    ) throws Exception {

        // Fetch all generations based on the list of IDs
        List<CarGeneration> generations = generationRepository.findAllById(generationIds);
        if (generations.isEmpty()) {
            throw new RuntimeException("At least one valid Car Generation must be selected");
        }

        SubCategory subCategory = subCategoryRepository.findById(subCategoryId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        Designation des = designationRepository.findById(desId)
                .orElseThrow(() -> new RuntimeException("Designation not found"));

        CarPart part = new CarPart();
        part.setName(name);
        part.setPrice(price);
        part.setInStock(inStock);
        part.setReference(ref);
        part.setDescription(desc);
        part.setSubCategory(subCategory);
        part.setDesignation(des);

        part.setOnSale(onSale);
        part.setSalePercentage(salePercentage);
        part.calculateSalePrice();

        // Use the new ManyToMany list field
        part.setCompatibleGenerations(generations);

        if (imageFile != null && !imageFile.isEmpty()) {
            part.setImage(fileUploadService.upload(imageFile, "parts"));
        }

        return mapper.toPartDTO(partRepository.save(part));
    }

    @Transactional
    public CarPartDTO updatePart(
            Long id,
            String name,
            double price,
            boolean inStock,
            List<Long> generationIds, // Accept a list of IDs now
            Long subCategoryId,
            Long desId,
            String ref,
            String desc,
            boolean onSale,
            int salePercentage,

            MultipartFile imageFile
    ) throws Exception {

        CarPart part = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Part not found"));

        part.setName(name);
        part.setPrice(price);
        part.setInStock(inStock);
        part.setDescription(desc);
        part.setReference(ref);

        part.setOnSale(onSale);
        part.setSalePercentage(salePercentage);
        part.calculateSalePrice();

        // Update Compatibility (ManyToMany)
        List<CarGeneration> generations = generationRepository.findAllById(generationIds);
        part.setCompatibleGenerations(generations);

        // Update SubCategory
        if (!part.getSubCategory().getId().equals(subCategoryId)) {
            SubCategory subCategory = subCategoryRepository.findById(subCategoryId)
                    .orElseThrow(() -> new RuntimeException("SubCategory not found"));
            part.setSubCategory(subCategory);
        }
        if (!part.getDesignation().getId().equals(desId)) {

            Designation designation = designationRepository.findById(desId)
                    .orElseThrow(() -> new RuntimeException("Designation not found"));
            part.setDesignation(designation);
        }
        // Image handling
        if (imageFile != null && !imageFile.isEmpty()) {
            String newImage = fileUploadService.upload(imageFile, "parts");
            if (part.getImage() != null) {
                fileUploadService.delete(part.getImage());
            }
            part.setImage(newImage);
        }

        return mapper.toPartDTO(partRepository.save(part));
    }

    @Transactional
    public Page<CarPartDTO> getPartsByGeneration(Long generationId, Long designationId, Long categoryId, Long subCategoryId, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findByGenerationIdFiltered(generationId, designationId, categoryId, subCategoryId, pageable)
                .map(mapper::toPartDTO);
    }

    @Transactional
    public Page<CarPartDTO> getPartsBySubCategory(Long subcategoryId, Long designationId, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findBySubCategoryIdFiltered(subcategoryId, designationId, pageable)
                .map(mapper::toPartDTO);
    }

    @Transactional
    public Page<CarPartDTO> getAllParts(Long designationId, Long categoryId, Long subCategoryId ,int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findAllFiltered(designationId, categoryId, subCategoryId, pageable)
                .map(mapper::toPartDTO);
    }

    @Transactional
    public Page<CarPartDTO> getAllPartsOnSale( int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.findAllByOnSaleIsTrue(pageable)
                .map(mapper::toPartDTO);
    }


    @Transactional
    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }
    @Transactional

    public CarPartDTO getPartById(Long id) {
        CarPart part = partRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Part not found"));
        return mapper.toPartDTO(part);
    }

    @Transactional
    public Page<CarPartDTO> searchParts(String query, int page) {
        Pageable pageable = PageRequest.of(page, 12);
        return partRepository.searchParts(query, pageable).map(mapper::toPartDTO);
    }
}
