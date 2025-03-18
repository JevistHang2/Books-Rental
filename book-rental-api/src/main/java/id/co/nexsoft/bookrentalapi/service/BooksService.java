package id.co.nexsoft.bookrentalapi.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import id.co.nexsoft.bookrentalapi.model.Books;
import id.co.nexsoft.bookrentalapi.repository.BooksRepository;

@Service
public class BooksService {
	@Autowired
	private BooksRepository booksRepo;

	public ResponseEntity<?> addBooks(Books book) {
		return ResponseEntity.ok().body(booksRepo.save(book));
	}

	public ResponseEntity<?> getAllBooks() {
		return ResponseEntity.ok().body(booksRepo.getAllBooks());
	}

	public ResponseEntity<?> getAllBooksPagination(int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok().body(booksRepo.getAllBooksPagination(pageable));
	}

	public ResponseEntity<?> getBookByBookId(int id) {
		return ResponseEntity.ok().body(booksRepo.getBookByBookId(id));
	}

	public ResponseEntity<?> updateBook(Books book) {
		booksRepo.updateBook(book.getId(), book.getAuthor(), book.getDescription(), book.getPrice(), book.getStock(),
				book.getTitle(), book.getType().getId());
		return ResponseEntity.ok().body(book.getId());
	}

	public ResponseEntity<?> deleteBook(Books book) {
		Date deleteDate = new Date();
		booksRepo.deleteBook(book.getId(), deleteDate);
		;
		return ResponseEntity.ok().body("Success Delete Book");
	}

	public ResponseEntity<?> searchBooksByTitleOrAuthor(String key) {
		return ResponseEntity.ok().body(booksRepo.searchBooksByTitleOrAuthor(key));
	}

	public ResponseEntity<?> searchBooksByTitleOrAuthorPagination(String key, int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok().body(booksRepo.searchBooksByTitleOrAuthorPagination(key, pageable));
	}
}
