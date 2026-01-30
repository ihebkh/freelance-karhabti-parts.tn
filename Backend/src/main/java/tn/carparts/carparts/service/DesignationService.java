package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.DesignationDTO;
import tn.carparts.carparts.entity.Designation;
import tn.carparts.carparts.mapper.CarMapper;
import tn.carparts.carparts.repository.DesignationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignationService {

    private final DesignationRepository designationRepository;
    private final FileUploadService fileUploadService;
    private final CarMapper mapper;

    public DesignationDTO create(String name, MultipartFile logo) throws Exception {
        if (designationRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Designation already exists");
        }

        Designation designation = new Designation();
        designation.setName(name);

        if (logo != null && !logo.isEmpty()) {
            designation.setLogo(fileUploadService.upload(logo, "designations"));
        }

        return mapper.toDesignationDTO(designationRepository.save(designation));
    }


    public DesignationDTO update(Long id, String name, MultipartFile logo) throws Exception {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found"));

        designation.setName(name);

        if (logo != null && !logo.isEmpty()) {
            String newLogo = fileUploadService.upload(logo, "designations");
            if (designation.getLogo() != null) {
                fileUploadService.delete(designation.getLogo());
            }
            designation.setLogo(newLogo);
        }

        return mapper.toDesignationDTO(designationRepository.save(designation));
    }
    @Transactional
    public void delete(Long id) throws Exception {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found"));

        if (designation.getLogo() != null) {
            fileUploadService.delete(designation.getLogo());
        }
        designationRepository.delete(designation);
    }

    @Transactional
    public List<DesignationDTO> findAll() {
        return designationRepository.findAll().stream()
                .map(mapper::toDesignationDTO)
                .toList();
    }
}