package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.AccPartDTO;
import tn.carparts.carparts.service.AccPartService;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/acc-parts")
@RequiredArgsConstructor
public class AccPartController {

    private final AccPartService partService;

    @GetMapping("/category/{categoryAccId}")
    public Page<AccPartDTO> getByCategoryAcc(
            @PathVariable Long categoryAccId,
            @RequestParam(required = false) Long designationId,
            @RequestParam(defaultValue = "0") int page
    ) {
        return partService.getPartsByCategoryAcc(categoryAccId, designationId, page);
    }

    @GetMapping("/on-sale")
    public Page<AccPartDTO> getAllPartsOnSale(
            @RequestParam(defaultValue = "0") int page
    ) {
        return partService.getAllPartsOnSale(page);
    }

    @GetMapping
    public Page<AccPartDTO> getAllParts(
            @RequestParam(required = false) Long designationId,
            @RequestParam(required = false) Long categoryAccId,
            @RequestParam(defaultValue = "0") int page
    ) {
        return partService.getAllParts(designationId, categoryAccId, page);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AccPartDTO create(
            @RequestParam Long categoryAccId,
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam double costPrice,
            @RequestParam boolean inStock,
            @RequestParam Long desId,
            @RequestParam String ref,
            @RequestParam String desc,
            @RequestParam boolean onSale,
            @RequestParam int salePercentage,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws Exception {
        return partService.createPart(
                categoryAccId, name, price, costPrice,
                inStock, desId, ref, desc, onSale, salePercentage, imageFile
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AccPartDTO update(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam double costPrice,
            @RequestParam boolean inStock,
            @RequestParam Long categoryAccId,
            @RequestParam Long desId,
            @RequestParam String ref,
            @RequestParam String desc,
            @RequestParam boolean onSale,
            @RequestParam int salePercentage,
            @RequestParam(required = false) MultipartFile imageFile
    ) throws Exception {
        return partService.updatePart(
                id, name, price, costPrice, inStock,
                categoryAccId, desId, ref, desc, onSale, salePercentage, imageFile
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        partService.deletePart(id);
    }

    @GetMapping("/{id}")
    public AccPartDTO getOne(@PathVariable Long id) {
        return partService.getPartById(id);
    }

    @GetMapping("/search")
    public Page<AccPartDTO> search(@RequestParam String q, @RequestParam(defaultValue = "0") int page) {
        return partService.searchParts(q, page);
    }
}

