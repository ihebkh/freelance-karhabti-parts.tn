package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public CategoryAccDTO create(String name, MultipartFile image) throws Exception {

        if (categoryAccRepository.existsByName(name)) {
            throw new RuntimeException("CategoryAcc already exists");
        }

        CategoryAcc categoryAcc = new CategoryAcc();
        categoryAcc.setName(name);

        if (image != null && !image.isEmpty()) {
            categoryAcc.setImage(fileUploadService.upload(image, "categoryacc"));
        }

        categoryAcc = categoryAccRepository.save(categoryAcc);
        return toDTO(categoryAcc);
    }

    @Transactional
    public CategoryAccDTO update(Long id, String name, MultipartFile image) throws Exception {

        CategoryAcc categoryAcc = categoryAccRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CategoryAcc not found"));

        categoryAcc.setName(name);

        if (image != null && !image.isEmpty()) {
            String newImage = fileUploadService.upload(image, "categoryacc");

            if (categoryAcc.getImage() != null) {
                fileUploadService.delete(categoryAcc.getImage());
            }

            categoryAcc.setImage(newImage);
        }

        categoryAcc = categoryAccRepository.save(categoryAcc);
        return toDTO(categoryAcc);
    }

    @Transactional
    public List<CategoryAccDTO> getAll() {
        return categoryAccRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        categoryAccRepository.deleteById(id);
    }

    private CategoryAccDTO toDTO(CategoryAcc ca) {
        return new CategoryAccDTO(
                ca.getId(),
                ca.getName(),
                ca.getImage()
        );
    }
}