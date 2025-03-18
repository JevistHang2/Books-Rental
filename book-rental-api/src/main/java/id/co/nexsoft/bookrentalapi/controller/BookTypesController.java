package id.co.nexsoft.bookrentalapi.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import id.co.nexsoft.bookrentalapi.model.BookTypes;
import id.co.nexsoft.bookrentalapi.service.BookTypesService;

@RestController
@RequestMapping("api/")
public class BookTypesController {

	@Autowired
	private BookTypesService bookTypesService;

	@PostMapping("/admin/booktypes")
	public ResponseEntity<?> addBookTypes(@Valid @RequestBody BookTypes bookTypes) {
		return bookTypesService.addBookTypes(bookTypes);
	}

	@GetMapping("/getbooktypes")
	public ResponseEntity<?> getAllBookTypes() {
		return bookTypesService.getBookTypes();
	}

	@PostMapping("/admin/updatebooktypes")
	public ResponseEntity<?> updateBookTypes(@Valid @RequestBody BookTypes bookTypes) {
		return bookTypesService.updateBookTypes(bookTypes);
	}

	@PostMapping("/admin/deletebooktypes")
	public ResponseEntity<?> deleteBookTypes(@RequestBody BookTypes bookTypes) {
		return bookTypesService.deleteBookTypes(bookTypes);
	}

	@GetMapping("/admin/getbooktypes/key={key}")
	public ResponseEntity<?> searchBookTypesByName(@PathVariable("key") String key) {
		return bookTypesService.searchBookTypesByName(key);
	}

	@GetMapping("/admin/getbooktypespagination/key={key}")
	public ResponseEntity<?> searchBookTypesByNamePagination(@PathVariable("key") String key,
			@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "5") Integer pageSize) {
		return bookTypesService.searchBookTypesByNamePagination(key, pageNo, pageSize);
	}
}
