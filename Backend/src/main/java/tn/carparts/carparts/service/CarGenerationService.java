package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CarGenerationDTO;
import tn.carparts.carparts.DTO.CarGenerationWithModelDTO;
import tn.carparts.carparts.entity.CarGeneration;
import tn.carparts.carparts.entity.CarModel;
import tn.carparts.carparts.mapper.CarMapper;
import tn.carparts.carparts.repository.CarGenerationRepository;
import tn.carparts.carparts.repository.CarModelRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarGenerationService {

    private final CarGenerationRepository generationRepository;
    private final CarModelRepository modelRepository;
    private final FileUploadService fileUploadService;
    private final CarMapper carMapper;

    public CarGenerationDTO create(Long modelId, String name, MultipartFile image) throws Exception {

        if (generationRepository.existsByNameIgnoreCaseAndModelId(name, modelId)) {
            throw new RuntimeException("Generation already exists for this model");
        }

        CarModel model = modelRepository.findById(modelId)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        CarGeneration generation = new CarGeneration();
        generation.setName(name);
        generation.setModel(model);

        if (image != null && !image.isEmpty()) {
            generation.setImage(fileUploadService.upload(image, "generations"));
        }

        return carMapper.toGenerationDTO(generationRepository.save(generation));
    }

    public CarGenerationDTO update(Long id, String name, MultipartFile image) throws Exception {

        CarGeneration generation = generationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Generation not found"));

        generation.setName(name);

        if (image != null && !image.isEmpty()) {
            String newImage = fileUploadService.upload(image, "generations");
            if (generation.getImage() != null) {
                fileUploadService.delete(generation.getImage());
            }
            generation.setImage(newImage);
        }

        return carMapper.toGenerationDTO(generationRepository.save(generation));
    }

    public void delete(Long id) throws Exception {

        CarGeneration generation = generationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Generation not found"));

        if (generation.getImage() != null) {
            fileUploadService.delete(generation.getImage());
        }

        generationRepository.delete(generation);
    }

    public List<CarGenerationDTO> getByModel(Long modelId) {
        return generationRepository.findByModelId(modelId)
                .stream()
                .map(carMapper::toGenerationDTO)
                .toList();
    }



    public List<CarGenerationWithModelDTO> getAllGenerations() {
        return generationRepository.findAllWithModelName();
    }
}
