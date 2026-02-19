package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CategoryAccDTO;
import tn.carparts.carparts.service.CategoryAccService;

import java.util.List;

@RestController
@RequestMapping("/admin/categoriesAcc")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminCategoryAccController {

    private final CategoryAccService categoryAccService;



    // CategoryAcc endpoints
    @PostMapping(value = "/categoryacc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CategoryAccDTO createCategoryAcc(
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return  categoryAccService.create(name, image);
    }

    @GetMapping("/categoryacc")
    public List<CategoryAccDTO> getAllCategoryAcc() {
        return categoryAccService.getAll();
    }

    @PutMapping(value = "/categoryacc/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CategoryAccDTO updateCategoryAcc(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return categoryAccService.update(id, name, image);
    }

    @DeleteMapping("/categoryacc/{id}")
    public void deleteCategoryAcc(@PathVariable Long id) {
        categoryAccService.delete(id);
    }
}
