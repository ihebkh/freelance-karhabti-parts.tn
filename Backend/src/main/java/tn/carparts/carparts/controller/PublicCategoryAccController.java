package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.carparts.carparts.DTO.CategoryAccDTO;
// import tn.carparts.carparts.DTO.SubCategoryAccDTO;
import tn.carparts.carparts.service.CategoryAccService;
// import tn.carparts.carparts.service.SubCategoryAccService;

import java.util.List;

@RestController
@RequestMapping("/categoriesAcc")
@RequiredArgsConstructor
public class PublicCategoryAccController {

    private final CategoryAccService categoryAccService;
    // private final SubCategoryAccService subCategoryAccService;

    @GetMapping
    public List<CategoryAccDTO> getCategories() {
        return categoryAccService.findAll();
    }

    // @GetMapping("/{categoryId}/subcategories")
    // public List<SubCategoryAccDTO> getSubCategories(@PathVariable Long categoryId) {
    //     return subCategoryAccService.getByCategory(categoryId);
    // }
}