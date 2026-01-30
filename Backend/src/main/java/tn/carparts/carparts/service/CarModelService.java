package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CarModelDTO;
import tn.carparts.carparts.entity.CarBrand;
import tn.carparts.carparts.entity.CarModel;
import tn.carparts.carparts.mapper.CarMapper;
import tn.carparts.carparts.repository.CarBrandRepository;
import tn.carparts.carparts.repository.CarModelRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarModelService {

    private final CarModelRepository modelRepository;
    private final CarBrandRepository brandRepository;
    private final FileUploadService fileUploadService;
    private final CarMapper carMapper;

    public CarModelDTO create(Long brandId, String name, MultipartFile image) throws Exception {

        if (modelRepository.existsByNameIgnoreCaseAndBrandId(name, brandId)) {
            throw new RuntimeException("Model already exists for this brand");
        }

        CarBrand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        CarModel model = new CarModel();
        model.setName(name);
        model.setBrand(brand);

        if (image != null && !image.isEmpty()) {
            model.setImage(fileUploadService.upload(image, "models"));
        }

        return carMapper.toModelDTO(modelRepository.save(model));
    }

    public CarModelDTO update(Long id, String name, MultipartFile image) throws Exception {

        CarModel model = modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        model.setName(name);

        if (image != null && !image.isEmpty()) {
            String newImage = fileUploadService.upload(image, "models");
            if (model.getImage() != null) {
                fileUploadService.delete(model.getImage());
            }
            model.setImage(newImage);
        }

        return carMapper.toModelDTO(modelRepository.save(model));
    }

    public void delete(Long id) throws Exception {

        CarModel model = modelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        if (model.getImage() != null) {
            fileUploadService.delete(model.getImage());
        }

        modelRepository.delete(model);
    }

    public List<CarModelDTO> getByBrand(Long brandId) {
        return modelRepository.findByBrandId(brandId)
                .stream()
                .map(carMapper::toModelDTO)
                .toList();
    }

    public CarModel findByName(String name){
        CarModel brand = modelRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        return brand;
    }
}
