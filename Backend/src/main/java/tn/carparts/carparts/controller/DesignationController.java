package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.DesignationDTO;
import tn.carparts.carparts.service.DesignationService;

import java.util.List;

@RestController
@RequestMapping("/designations")
@RequiredArgsConstructor
public class DesignationController {

    private final DesignationService designationService;

    @GetMapping
    public List<DesignationDTO> getAll() {
        return designationService.findAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DesignationDTO create(
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile logo
    ) throws Exception {
        return designationService.create(name, logo);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DesignationDTO update(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile logo
    ) throws Exception {
        return designationService.update(id, name, logo);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws Exception {
        designationService.delete(id);
    }
}