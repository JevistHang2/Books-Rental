package id.co.nexsoft.bookrentalapi.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import id.co.nexsoft.bookrentalapi.dto.BooksDTO;
import id.co.nexsoft.bookrentalapi.model.Books;

@Repository
public interface BooksRepository extends JpaRepository<Books, Integer> {
	@Query(value = "SELECT b.id, b.title, b.author, b.type_id, b.stock, b.price, " 
					+ "b.description, b.delete_date "
					+ "FROM books b " 
					+ "WHERE b.delete_date is null " 
					+ "ORDER BY b.id DESC"
					, nativeQuery = true)
	List<Books> getAllBooks();

	@Query(value = "SELECT b.id, b.title, b.author, b.type_id, b.stock, b.price, b.description, b.delete_date " 
					+ "FROM books b "
					+ "WHERE b.delete_date is null " 
					+ "AND b.id = :bookId"
					, nativeQuery = true)
	Books getBookByBookId(@Param("bookId") int bookId);

	@Query(value = "SELECT b.stock " 
					+ "FROM books b " 
					+ "WHERE b.delete_date is null " 
					+ "AND b.id = :id"
					, nativeQuery = true)
	int getStockByBookId(@Param("id") int id);

	@Query(value = "SELECT b.id, b.title, b.author, b.type_id, b.stock, b.price, b.description, b.delete_date " 
					+ "FROM books b " 
					+ "WHERE b.delete_date is null " 
					+ "AND (b.title LIKE %:key% OR b.author LIKE %:key%) " 
					+ "ORDER BY b.id DESC"
					, nativeQuery = true)
	List<Books> searchBooksByTitleOrAuthor(@Param("key") String key);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.BooksDTO " 
			+ "(b.id, b.title, b.author, b.type, b.stock, b.price, b.description, b.deleteDate) " 
			+ "FROM Books b " 
			+ "WHERE b.deleteDate is null " 
			+ "ORDER BY b.id DESC")
	Page<BooksDTO> getAllBooksPagination(Pageable pageable);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.BooksDTO " 
			+ "(b.id, b.title, b.author, b.type, b.stock, b.price, b.description, b.deleteDate) " 
			+ "FROM Books b " 
			+ "WHERE b.deleteDate is null " 
			+ "AND (b.title LIKE %:key% OR b.author LIKE %:key%) " 
			+ "ORDER BY b.id DESC")
	Page<BooksDTO> searchBooksByTitleOrAuthorPagination(@Param("key") String key, Pageable pageable);

	@Transactional
	@Modifying
	@Query(value = "INSERT INTO books " 
					+ "(title, author, type_id, price, stock, description) " 
					+ "VALUES (:#{#book.title}, :#{#book.author}, :#{#book.type}, " 
					+ ":#{#book.price}, :#{#book.stock}, :#{#book.description})"
					, nativeQuery = true)
	void saveBooks(@Param("book") Books books);

	@Transactional
	@Modifying
	@Query(value = "UPDATE books b " 
					+ "SET b.author = :author, b.description = :description, b.price = :price, " 
					+ "b.stock = :stock, b.title = :title, b.type_id = :type " 
					+ "WHERE b.id = :id"
					, nativeQuery = true)
	void updateBook(@Param("id") int id, @Param("author") String author, @Param("description") String description,
			@Param("price") long price, @Param("stock") int stock, @Param("title") String title,
			@Param("type") int type);

	@Transactional
	@Modifying
	@Query(value = "UPDATE books b " 
					+ "SET b.delete_date = :deleteDate " 
					+ "WHERE b.id = :id"
					, nativeQuery = true)
	void deleteBook(@Param("id") int id, @Param("deleteDate") Date deleteDate);

	@Transactional
	@Modifying
	@Query(value = "UPDATE books b " 
					+ "SET b.stock = :stock "
					+ "WHERE b.id = :id"
					, nativeQuery = true)
	void updateStock(@Param("id") int id, @Param("stock") int stock);
}
