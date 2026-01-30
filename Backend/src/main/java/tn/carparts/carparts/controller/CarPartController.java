package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CarPartDTO;
import tn.carparts.carparts.entity.CarPart;
import tn.carparts.carparts.service.CarPartService;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/parts")
@RequiredArgsConstructor
public class CarPartController {

    private final CarPartService partService;

    @GetMapping("/generation/{generationId}")
    public Page<CarPartDTO> getByGeneration(
            @PathVariable Long generationId,
            @RequestParam(required = false) Long designationId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subCategoryId,
            @RequestParam(defaultValue = "0") int page) {
        return partService.getPartsByGeneration(generationId, designationId, categoryId, subCategoryId, page);
    }

    @GetMapping("/subcategory/{subCategoryId}")
    public Page<CarPartDTO> getBySubCategory(
            @PathVariable Long subCategoryId,
            @RequestParam(required = false) Long designationId, // New
            @RequestParam(defaultValue = "0") int page) {
        return partService.getPartsBySubCategory(subCategoryId, designationId, page);
    }

    @GetMapping("/on-sale")
    public Page<CarPartDTO> getAllPartsOnSale(
            @RequestParam(defaultValue = "0") int page) {
        return partService.getAllPartsOnSale(page);
    }

    @GetMapping
    public Page<CarPartDTO> getAllParts(
            @RequestParam(required = false) Long designationId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long subCategoryId,

            @RequestParam(defaultValue = "0") int page) {
        return partService.getAllParts(designationId, categoryId, subCategoryId, page);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping(
            value = "", // Removed generationId from path
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarPartDTO create(
            @RequestParam List<Long> generationIds, // Now a List
            @RequestParam Long subCategoryId,
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam boolean inStock,
            @RequestParam Long desId,
            @RequestParam String ref,
            @RequestParam String desc,
            @RequestParam boolean onSale,
            @RequestParam int salePercentage,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws Exception {
        return partService.createPart(
                generationIds,
                subCategoryId,
                name,
                price,
                inStock,
                desId,
                ref,
                desc,
                onSale,
                salePercentage,
                imageFile
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CarPartDTO update(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam boolean inStock,
            @RequestParam List<Long> generationIds,
            @RequestParam Long subCategoryId,
            @RequestParam Long desId,
            @RequestParam String ref,
            @RequestParam String desc,
            @RequestParam boolean onSale,
            @RequestParam int salePercentage,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws Exception {
        return partService.updatePart(
                id,
                name,
                price,
                inStock,
                generationIds,
                subCategoryId,
                desId,
                ref,
                desc,
                onSale,
                salePercentage,
                imageFile
        );
    }



    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        partService.deletePart(id);
    }


    @GetMapping("/{id}")
    public CarPartDTO getOne(@PathVariable Long id) {
        return partService.getPartById(id);
    }
    @GetMapping("/search")
    public Page<CarPartDTO> search(@RequestParam String q, @RequestParam(defaultValue = "0") int page) {
        return partService.searchParts(q, page);
    }
}
