package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CategoryDTO;
import tn.carparts.carparts.entity.Category;
import tn.carparts.carparts.repository.CategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;

    public CategoryDTO create(String name, MultipartFile image) throws Exception {
        if (categoryRepository.existsByName(name)) {
            throw new RuntimeException("Category already exists");
        }

        Category category = new Category();
        category.setName(name);

        if (image != null && !image.isEmpty()) {
            category.setImage(fileUploadService.upload(image, "categories"));
        }

        category = categoryRepository.save(category);

        // Return with empty list as there are no subcategories yet
        return new CategoryDTO(category.getId(), category.getName(), category.getImage(), List.of());
    }

    public CategoryDTO update(Long id, String name, MultipartFile image) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(name);

        if (image != null && !image.isEmpty()) {
            String newImage = fileUploadService.upload(image, "categories");
            if (category.getImage() != null) {
                fileUploadService.delete(category.getImage());
            }
            category.setImage(newImage);
        }

        category = categoryRepository.save(category);
        return mapToDTO(category);
    }

    public List<CategoryDTO> findAll() {
        return categoryRepository.findAllWithSubCategories()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // Helper method to handle the nested SubCategory mapping
    private CategoryDTO mapToDTO(Category c) {
        // This now works because the session is still open OR data is already fetched
        var subCategoryDTOs = c.getSubCategories().stream()
                .map(sc -> new tn.carparts.carparts.DTO.SubCategoryDTO(
                        sc.getId(),
                        sc.getName(),
                        sc.getImage(),
                        c.getId(),
                        c.getName()
                ))
                .toList();

        return new CategoryDTO(c.getId(), c.getName(), c.getImage(), subCategoryDTOs);
    }

    public void delete(Long id){
        categoryRepository.deleteById(id);
    }
}