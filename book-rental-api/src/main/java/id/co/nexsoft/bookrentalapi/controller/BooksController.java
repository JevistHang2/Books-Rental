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

import id.co.nexsoft.bookrentalapi.model.Books;
import id.co.nexsoft.bookrentalapi.service.BooksService;

@RestController
@RequestMapping("api/")
public class BooksController {
	@Autowired
	private BooksService booksService;

	@PostMapping("/admin/books")
	public ResponseEntity<?> addBooks(@Valid @RequestBody Books book) {
		return booksService.addBooks(book);
	}

	@GetMapping("/getbooks")
	public ResponseEntity<?> getAllBooks() {
		return booksService.getAllBooks();
	}

	@GetMapping("/getbookspagination")
	public ResponseEntity<?> getAllBooksPagination(@RequestParam(defaultValue = "0") Integer pageNo,
			@RequestParam(defaultValue = "5") Integer pageSize) {
		return booksService.getAllBooksPagination(pageNo, pageSize);
	}

	@PostMapping("/admin/updatebook")
	public ResponseEntity<?> updateBooks(@Valid @RequestBody Books book) {
		return booksService.updateBook(book);
	}

	@PostMapping("/admin/deletebook")
	public ResponseEntity<?> deleteBook(@RequestBody Books book) {
		return booksService.deleteBook(book);
	}

	@GetMapping("/getbooks/key={key}")
	public ResponseEntity<?> searchBooksByTitleOrAuthor(@PathVariable("key") String key) {
		return booksService.searchBooksByTitleOrAuthor(key);
	}
	
	@GetMapping("/getbookspagination/key={key}")
	public ResponseEntity<?> searchBooksByTitleOrAuthorPagination(@PathVariable("key") String key, @RequestParam(defaultValue = "0") Integer pageNo,
			@RequestParam(defaultValue = "5") Integer pageSize) {
		return booksService.searchBooksByTitleOrAuthorPagination(key, pageNo, pageSize);
	}

	@GetMapping("/user/getbooks/bookid={bookId}")
	public ResponseEntity<?> getBookByBookId(@PathVariable("bookId") int bookId) {
		return booksService.getBookByBookId(bookId);
	}
}
