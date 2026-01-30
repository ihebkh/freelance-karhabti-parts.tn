package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CategoryDTO;
import tn.carparts.carparts.DTO.SubCategoryDTO;
import tn.carparts.carparts.service.CategoryService;
import tn.carparts.carparts.service.SubCategoryService;

@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminCategoryController {

    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CategoryDTO createCategory(
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return categoryService.create(name, image);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public CategoryDTO updateCategory(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return categoryService.update(id, name, image);
    }

    @PostMapping(
            value = "/{categoryId}/subcategories",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public SubCategoryDTO createSubCategory(
            @PathVariable Long categoryId,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return subCategoryService.create(categoryId, name, image);
    }

    @PutMapping(
            value = "/subcategories/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public SubCategoryDTO updateSubCategory(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image
    ) throws Exception {
        return subCategoryService.update(id, name, image);
    }


    @DeleteMapping("/{id}")
    public void deleteC(@PathVariable Long id) {
        categoryService.delete(id);
    }


    @DeleteMapping("/subcategories/{id}")
    public void deleteSubC(@PathVariable Long id) {
        subCategoryService.delete(id);
    }

}
