package tn.carparts.carparts.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.DesignationPartDTO;
import tn.carparts.carparts.entity.DesignationPart;
import tn.carparts.carparts.repository.DesignationPartRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignationPartService {

    private final DesignationPartRepository designationPartRepository;
    private final FileUploadService fileUploadService;

    public DesignationPartDTO create(String namePart, MultipartFile logo) throws Exception {
        if (designationPartRepository.existsByNamePartIgnoreCase(namePart)) {
            throw new RuntimeException("DesignationPart already exists");
        }

        DesignationPart designationPart = new DesignationPart();
        designationPart.setNamePart(namePart);

        if (logo != null && !logo.isEmpty()) {
            designationPart.setLogo(fileUploadService.upload(logo, "designationsPart"));
        }

        DesignationPart saved = designationPartRepository.save(designationPart);
        return designationPartRepository.findDtoByIdWithPartCount(saved.getId())
                .orElseThrow(() -> new RuntimeException("DesignationPart not found"));
    }

    @Transactional
    public DesignationPartDTO update(Long id, String namePart, MultipartFile logo) throws Exception {
        DesignationPart designationPart = designationPartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DesignationPart not found"));

        designationPart.setNamePart(namePart);

        if (logo != null && !logo.isEmpty()) {
            String newLogo = fileUploadService.upload(logo, "designationsPart");
            if (designationPart.getLogo() != null) {
                fileUploadService.delete(designationPart.getLogo());
            }
            designationPart.setLogo(newLogo);
        }

        designationPartRepository.save(designationPart);
        return designationPartRepository.findDtoByIdWithPartCount(id)
                .orElseThrow(() -> new RuntimeException("DesignationPart not found"));
    }

    @Transactional
    public void delete(Long id) throws Exception {
        DesignationPart designationPart = designationPartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DesignationPart not found"));

        if (designationPart.getLogo() != null) {
            fileUploadService.delete(designationPart.getLogo());
        }
        designationPartRepository.delete(designationPart);
    }

    @Transactional
    public List<DesignationPartDTO> findAll() {
        return designationPartRepository.findAllWithPartCount();
    }
}