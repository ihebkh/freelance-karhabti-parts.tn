package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CarBrandDTO;
import tn.carparts.carparts.DTO.CarGenerationDTO;
import tn.carparts.carparts.DTO.CarModelDTO;
import tn.carparts.carparts.service.CarBrandService;
import tn.carparts.carparts.service.CarGenerationService;
import tn.carparts.carparts.service.CarModelService;

@RestController
@RequestMapping("/admin/cars")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminCarController {

    private final CarBrandService brandService;
    private final CarModelService modelService;
    private final CarGenerationService generationService;

    // ===== BRANDS =====

    @PostMapping(
            value = "/brands",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarBrandDTO createBrand(
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile logo
    ) throws Exception {
        return brandService.create(name, logo);
    }

    @PutMapping(
            value = "/brands/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarBrandDTO  updateBrand(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile logo
    ) throws Exception {
        return brandService.update(id, name, logo);
    }

    @DeleteMapping("/brands/{id}")
    public void deleteBrand(@PathVariable Long id) throws Exception {
        brandService.delete(id);
    }
    // ===== MODELS =====
// ===== MODELS =====
    @PostMapping(
            value = "/brands/{brandId}/models",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarModelDTO createModel(
            @PathVariable Long brandId,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return modelService.create(brandId, name, image);
    }

    @PutMapping(
            value = "/models/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarModelDTO  updateModel(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return modelService.update(id, name, image);
    }

    @DeleteMapping("/models/{id}")
    public void deleteModel(@PathVariable Long id) throws Exception {
        modelService.delete(id);
    }


    // ===== GENERATIONS =====
    @PostMapping(
            value = "/models/{modelId}/generations",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarGenerationDTO createGeneration(
            @PathVariable Long modelId,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return generationService.create(modelId, name, image);
    }

    @PutMapping(
            value = "/generations/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CarGenerationDTO  updateGeneration(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return generationService.update(id, name, image);
    }

    @DeleteMapping("/generations/{id}")
    public void deleteGeneration(@PathVariable Long id) throws Exception {
        generationService.delete(id);
    }

}