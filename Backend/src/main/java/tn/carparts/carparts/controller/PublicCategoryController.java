package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.carparts.carparts.DTO.CategoryDTO;
import tn.carparts.carparts.DTO.SubCategoryDTO;
import tn.carparts.carparts.service.CategoryService;
import tn.carparts.carparts.service.SubCategoryService;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class PublicCategoryController {

    private final CategoryService categoryService;
    private final SubCategoryService subCategoryService;

    @GetMapping
    public List<CategoryDTO> getCategories() {
        return categoryService.findAll();
    }

    @GetMapping("/{categoryId}/subcategories")
    public List<SubCategoryDTO> getSubCategories(@PathVariable Long categoryId) {
        return subCategoryService.getByCategory(categoryId);
    }
}
