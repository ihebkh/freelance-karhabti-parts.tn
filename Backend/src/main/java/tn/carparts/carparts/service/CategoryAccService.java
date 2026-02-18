package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CategoryAccDTO;
import tn.carparts.carparts.entity.CategoryAcc;
import tn.carparts.carparts.repository.CategoryAccRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryAccService {

    private final CategoryAccRepository categoryAccRepository;
    private final FileUploadService fileUploadService;

    public CategoryAccDTO create(String nameAcc, MultipartFile image) throws Exception {
        if (categoryAccRepository.existsByNameAcc(nameAcc)) {
            throw new RuntimeException("CategoryAcc already exists");
        }

        CategoryAcc categoryAcc = new CategoryAcc();
        categoryAcc.setNameAcc(nameAcc);

        if (image != null && !image.isEmpty()) {
            categoryAcc.setImageAcc(fileUploadService.upload(image, "categoriesAcc"));
        }

        categoryAcc = categoryAccRepository.save(categoryAcc);

        // Return with empty list as there are no subcategories yet
        // return new CategoryAccDTO(categoryAcc.getId(), categoryAcc.getNameAcc(), categoryAcc.getImageAcc(), List.of());
        return new CategoryAccDTO(categoryAcc.getId(), categoryAcc.getNameAcc(), categoryAcc.getImageAcc());
    }

    public CategoryAccDTO update(Long id, String nameAcc, MultipartFile image) throws Exception {
        CategoryAcc categoryAcc = categoryAccRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CategoryAcc not found"));

        categoryAcc.setNameAcc(nameAcc);

        if (image != null && !image.isEmpty()) {
            String newImage = fileUploadService.upload(image, "categoriesAcc");
            if (categoryAcc.getImageAcc() != null) {
                fileUploadService.delete(categoryAcc.getImageAcc());
            }
            categoryAcc.setImageAcc(newImage);
        }

        categoryAcc = categoryAccRepository.save(categoryAcc);
        return mapToDTO(categoryAcc);
    }

    public List<CategoryAccDTO> findAll() {
        // return categoryAccRepository.findAllWithSubCategoriesAcc()
        //         .stream()
        //         .map(this::mapToDTO)
        //         .toList();
        return categoryAccRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CategoryAccDTO mapToDTO(CategoryAcc c) {
        // var subCategoryAccDTOs = c.getSubCategoriesAcc().stream()
        //         .map(sc -> new tn.carparts.carparts.DTO.SubCategoryAccDTO(
        //                 sc.getId(),
        //                 sc.getNameAcc(),
        //                 sc.getImageAcc(),
        //                 c.getId(),
        //                 c.getNameAcc()
        //         ))
        //         .toList();

        // return new CategoryAccDTO(c.getId(), c.getNameAcc(), c.getImageAcc(), subCategoryAccDTOs);
        return new CategoryAccDTO(c.getId(), c.getNameAcc(), c.getImageAcc());
    }

    public void delete(Long id) {
        categoryAccRepository.deleteById(id);
    }
}