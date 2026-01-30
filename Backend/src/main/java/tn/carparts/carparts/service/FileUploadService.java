package tn.carparts.carparts.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
@Service
public class FileUploadService {

    @Value("${application.file.uploads.photos-output-path}")
    private String rootUploadDir;

    public String upload(MultipartFile file, String subFolder) throws Exception {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String filename = System.currentTimeMillis()
                + "-" + UUID.randomUUID()
                + "-" + file.getOriginalFilename();

        Path folderPath = Paths.get(rootUploadDir, subFolder);

        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        Path filePath = folderPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return subFolder+"/"+filename;
    }

    public void delete( String filename) throws Exception {
        if (filename == null) return;

        Path path = Paths.get(rootUploadDir).resolve(filename);
        Files.deleteIfExists(path);
    }
}