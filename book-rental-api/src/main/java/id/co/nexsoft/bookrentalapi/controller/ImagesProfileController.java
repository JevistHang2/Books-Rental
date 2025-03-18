package id.co.nexsoft.bookrentalapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.service.ImagesProfileService;

@RestController
@RequestMapping("api/")
public class ImagesProfileController {
	@Autowired
	private ImagesProfileService imagesProfileService;
	
	@PostMapping(value = "updateprofileimages", consumes = {"multipart/form-data"})
	public ResponseEntity<?> updateProfileImage(@RequestParam("file")MultipartFile multipartFile, @RequestParam("userId") int userId) {
		return imagesProfileService.updateImageProfile(multipartFile, userId);
	}
	
	@PostMapping("deleteprofileimages")
	public ResponseEntity<?> deleteProfileImages(@RequestBody Users user) {
		return imagesProfileService.deleteImagesProfile(user);
	}
	
	@GetMapping("getprofileimages/userid={userId}")
	public ResponseEntity<?> getProfileImages(@PathVariable("userId") int userId) {
		return imagesProfileService.getImagesProfile(userId);
	}
}
