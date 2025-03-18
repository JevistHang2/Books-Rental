package id.co.nexsoft.bookrentalapi.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import id.co.nexsoft.bookrentalapi.model.BookTypes;
import id.co.nexsoft.bookrentalapi.repository.BookTypesRepository;

@Service
public class BookTypesService {
	@Autowired
	private BookTypesRepository bookTypesRepo;
	
	public ResponseEntity<?> addBookTypes(BookTypes bookTypes) {
		bookTypesRepo.save(bookTypes);
		return ResponseEntity.ok().body("Success Add New Category");
	}
	
	public ResponseEntity<?> getBookTypes() {
		return ResponseEntity.ok().body(bookTypesRepo.getAllBookType());
	}
	
	public ResponseEntity<?> updateBookTypes(BookTypes bookTypes) {
		bookTypesRepo.updateBookTypes(bookTypes.getId(), bookTypes.getName());
		return ResponseEntity.ok().body("Success Edit Book Type");
	}
	
	public ResponseEntity<?> deleteBookTypes(BookTypes bookTypes) {
		bookTypesRepo.deleteBookTypes(bookTypes.getId(), new Date());
		return ResponseEntity.ok().body("Success Delete Book Type");
	}
	
	public ResponseEntity<?> searchBookTypesByName(String key) {
		return ResponseEntity.ok().body(bookTypesRepo.searchBookTypesByName(key));
	}
	
	public ResponseEntity<?> searchBookTypesByNamePagination(String key, int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok().body(bookTypesRepo.searchBookTypesByNamePagination(key, pageable));
	}
}
