package tn.carparts.carparts.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CategoryDTO;
import tn.carparts.carparts.DTO.SubCategoryDTO;
import tn.carparts.carparts.entity.Category;
import tn.carparts.carparts.entity.SubCategory;
import tn.carparts.carparts.repository.CategoryRepository;
import tn.carparts.carparts.repository.SubCategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;

    @Transactional

    public SubCategoryDTO create(
            Long categoryId,
            String name,
            MultipartFile image
    ) throws Exception {

        if (subCategoryRepository.existsByName(name)) {
            throw new RuntimeException("SubCategory already exists");
        }

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        SubCategory subCategory = new SubCategory();
        subCategory.setName(name);
        subCategory.setCategory(category);

        if (image != null && !image.isEmpty()) {
            subCategory.setImage(fileUploadService.upload(image, "subcategories"));
        }

        subCategory = subCategoryRepository.save(subCategory);
        return toDTO(subCategory);
    }
    @Transactional

    public SubCategoryDTO update(
            Long id,
            String name,
            MultipartFile image
    ) throws Exception {

        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));

        subCategory.setName(name);

        if (image != null && !image.isEmpty()) {
            String newImage = fileUploadService.upload(image, "subcategories");

            if (subCategory.getImage() != null) {
                fileUploadService.delete(subCategory.getImage());
            }

            subCategory.setImage(newImage);
        }

        subCategory = subCategoryRepository.save(subCategory);
        return toDTO(subCategory);
    }
    @Transactional

    public List<SubCategoryDTO> getByCategory(Long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private SubCategoryDTO toDTO(SubCategory sc) {
        return new SubCategoryDTO(
                sc.getId(),
                sc.getName(),
                sc.getImage(),
                sc.getCategory().getId(),
                sc.getCategory().getName()
        );
    }
    @Transactional

    public void delete(Long id){
        subCategoryRepository.deleteById(id);
    }

}

