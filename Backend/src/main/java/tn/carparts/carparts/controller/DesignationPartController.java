package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.carparts.carparts.DTO.DesignationPartDTO;
import tn.carparts.carparts.service.DesignationPartService;

import java.util.List;

@RestController
@RequestMapping("/designations-part")
@RequiredArgsConstructor
public class DesignationPartController {

    private final DesignationPartService designationPartService;

    @GetMapping
    public List<DesignationPartDTO> getAll() {
        return designationPartService.findAll();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DesignationPartDTO create(
            @RequestParam String namePart,
            @RequestParam(required = false) MultipartFile logo
    ) throws Exception {
        return designationPartService.create(namePart, logo);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DesignationPartDTO update(
            @PathVariable Long id,
            @RequestParam String namePart,
            @RequestParam(required = false) MultipartFile logo
    ) throws Exception {
        return designationPartService.update(id, namePart, logo);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws Exception {
        designationPartService.delete(id);
    }
}