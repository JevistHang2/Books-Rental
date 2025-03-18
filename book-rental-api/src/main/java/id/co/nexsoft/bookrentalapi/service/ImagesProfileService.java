package id.co.nexsoft.bookrentalapi.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import id.co.nexsoft.bookrentalapi.model.Images;
import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.repository.ImagesProfileRepository;

@Service
public class ImagesProfileService {
	@Autowired
	private ImagesProfileRepository imagesProfileRepo;

	public ResponseEntity<?> updateImageProfile(MultipartFile file, int userId) {
		Images image = new Images();

		try {
			image.setFileData(file.getBytes());
			image.setFileName(file.getOriginalFilename());
			image.setFileType(file.getContentType());
		} catch (IOException e) {
			e.printStackTrace();
		}
		imagesProfileRepo.editImageProfileByUserId(image.getFileData(), image.getFileName(), image.getFileType(),
				userId);
		return ResponseEntity.ok().body("Success Edit Profile Images");
	}

	public ResponseEntity<?> deleteImagesProfile(Users user) {
		imagesProfileRepo.editImageProfileByUserId(null, null, null, user.getId());
		return ResponseEntity.ok().body("Success Delete Profile Images");
	}

	public ResponseEntity<?> getImagesProfile(int userId) {
		return ResponseEntity.ok().body(imagesProfileRepo.getImageProfileByUserId(userId));
	}
}
