package id.co.nexsoft.bookrentalapi.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;

import id.co.nexsoft.bookrentalapi.model.Books;
import id.co.nexsoft.bookrentalapi.model.Images;
import id.co.nexsoft.bookrentalapi.repository.ImagesRepository;

@Service
public class ImagesService {
	@Autowired
	private ImagesRepository imagesRepo;

	public ResponseEntity<?> addImages(MultipartFile file, String book) {
		Images image = new Images();
		Gson gson = new Gson();
		Books bookParseObject = gson.fromJson(book, Books.class);

		try {
			image.setFileData(file.getBytes());
			image.setFileName(file.getOriginalFilename());
			image.setFileType(file.getContentType());
			image.setBookId(bookParseObject);
		} catch (IOException e) {
			e.printStackTrace();
		}

		imagesRepo.addImages(image.getFileData(), image.getFileName(), image.getFileType(), image.getBookId().getId());
		return ResponseEntity.ok().body("Success Add Books & Images");
	}

	public ResponseEntity<?> editImageByBookId(MultipartFile file, int bookId) {
		Images image = new Images();

		try {
			image.setFileData(file.getBytes());
			image.setFileName(file.getOriginalFilename());
			image.setFileType(file.getContentType());
		} catch (IOException e) {
			e.printStackTrace();
		}
		imagesRepo.editImageByBookId(image.getFileData(), image.getFileName(), image.getFileType(), bookId);
		return ResponseEntity.ok().body("Success Edit Books & Images");
	}

	public ResponseEntity<?> getImageByBookId(int bookId) {
		return ResponseEntity.ok().body(imagesRepo.getImageBybookId(bookId));
	}
}
