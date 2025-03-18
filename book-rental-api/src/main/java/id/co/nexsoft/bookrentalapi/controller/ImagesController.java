package id.co.nexsoft.bookrentalapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import id.co.nexsoft.bookrentalapi.service.ImagesService;

@RestController
@RequestMapping("api/")
public class ImagesController {
	@Autowired
	private ImagesService imagesService;
	
	@PostMapping(value = "admin/addbookimages" , consumes = {"multipart/form-data"})
	public ResponseEntity<?> addImage(@RequestParam("file")MultipartFile multipartFile, @RequestParam("book") String book) {
		return imagesService.addImages(multipartFile, book);
	}
	
	@GetMapping("getimage/bookid={bookId}")
	public ResponseEntity<?> getImageByBookId(@PathVariable("bookId") int bookId) {
		return imagesService.getImageByBookId(bookId);
	}
	
	@PostMapping(value = "admin/editbookimages" , consumes = {"multipart/form-data"})
	public ResponseEntity<?> editBookImage(@RequestParam("file")MultipartFile multipartFile, @RequestParam("bookId") int bookId) {
		return imagesService.editImageByBookId(multipartFile, bookId);
	}
}
