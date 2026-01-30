package tn.carparts.carparts.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import tn.carparts.carparts.DTO.*;
import tn.carparts.carparts.entity.CarBrand;
import tn.carparts.carparts.entity.CarGeneration;
import tn.carparts.carparts.entity.CarModel;
import tn.carparts.carparts.service.CarBrandService;
import tn.carparts.carparts.service.CarGenerationService;
import tn.carparts.carparts.service.CarModelService;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
@RestController
@RequestMapping("/cars")
@RequiredArgsConstructor
public class PublicCarController {

    private final CarBrandService brandService;
    private final CarModelService modelService;
    private final CarGenerationService generationService;

    @GetMapping("/brands")
    public List<CarBrandDTO> getBrands() {
        return brandService.findAll();
    }

    @GetMapping("/brands/{brandId}/models")
    public List<CarModelDTO> getModels(@PathVariable Long brandId) {
        return modelService.getByBrand(brandId);
    }

    @GetMapping("/models/{modelId}/generations")
    public List<CarGenerationDTO> getGenerations(@PathVariable Long modelId) {
        return generationService.getByModel(modelId);
    }


    @GetMapping("/generations")
    public List<CarGenerationWithModelDTO> getAllGenerations() {
        return generationService.getAllGenerations();
    }





    @GetMapping("/uploads/{subfolder}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(
            @PathVariable String subfolder,
            @PathVariable String filename
    ) {
        try {
            Path file = Paths.get("uploads").resolve(subfolder).resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "application/octet-stream";
            if (filename.endsWith(".png")) contentType = "image/png";
            else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (filename.endsWith(".gif")) contentType = "image/gif";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }



    @GetMapping("/vin-lookup/{vin}")
    public ResponseEntity<?> lookupVin(@PathVariable String vin) {

        String webhookUrl = "http://84.247.131.212:5678/webhook/9b871184-d932-4398-9cc5-452a691b23bb";
        RestTemplate restTemplate = new RestTemplate();

        List<Map<String, String>> requestBody = List.of(Map.of("Car Vin", vin));

        try {
            Map<String, Object> response = restTemplate.postForObject(webhookUrl, requestBody, Map.class);

            if (response != null) {

                String brandName = (String) response.get("car brand");
                String modelName = (String) response.get("car model");

                if (modelName != null && modelName.contains("-")) {
                    CarBrand brand = brandService.findByName(brandName);
                    if (brand == null) throw new RuntimeException("Brand not found in DB: " + brandName);
                    return ResponseEntity.ok(Map.of("type", "brand", "id", brand.getId()));
                } else {
                    CarModel model = modelService.findByName(modelName);
                    if (model == null) throw new RuntimeException("Model not found in DB: " + modelName);
                    return ResponseEntity.ok(Map.of("type", "model", "id", model.getId()));
                }
            }
        } catch (org.springframework.web.client.HttpStatusCodeException e) {
            System.err.println("ERROR: Webhook returned status " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body("Webhook error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            System.err.println("ERROR: Exception during lookup: ");
            e.printStackTrace(); // This will show you the exact line number in your IDE console
            return ResponseEntity.status(500).body("Internal Error: " + e.getMessage());
        }
        return ResponseEntity.notFound().build();
    }
}