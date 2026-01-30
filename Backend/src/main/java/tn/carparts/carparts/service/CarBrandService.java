package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.CarBrandDTO;
import tn.carparts.carparts.entity.CarBrand;
import tn.carparts.carparts.mapper.CarMapper;
import tn.carparts.carparts.repository.CarBrandRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarBrandService {

    private final CarBrandRepository brandRepository;
    private final FileUploadService fileUploadService;
    private final CarMapper carMapper;

    public CarBrandDTO create(String name, MultipartFile logo) throws Exception {

        if (brandRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Brand already exists");
        }

        CarBrand brand = new CarBrand();
        brand.setName(name);

        if (logo != null && !logo.isEmpty()) {
            brand.setLogo(fileUploadService.upload(logo, "brands"));
        }

        return carMapper.toBrandDTO(brandRepository.save(brand));
    }

    public CarBrandDTO update(Long id, String name, MultipartFile logo) throws Exception {

        CarBrand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        brand.setName(name);

        if (logo != null && !logo.isEmpty()) {
            String newLogo = fileUploadService.upload(logo, "brands");
            if (brand.getLogo() != null) {
                fileUploadService.delete(brand.getLogo());
            }
            brand.setLogo(newLogo);
        }

        return carMapper.toBrandDTO(brandRepository.save(brand));
    }

    public void delete(Long id) throws Exception {
        CarBrand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        if (brand.getLogo() != null) {
            fileUploadService.delete(brand.getLogo());
        }

        brandRepository.delete(brand);
    }

    public List<CarBrandDTO> findAll() {
        return brandRepository.findAll()
                .stream()
                .map(carMapper::toBrandDTO)
                .toList();
    }


    public CarBrand findByName(String name){
        CarBrand brand = brandRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Brand not found"));

        return brand;
    }
}
