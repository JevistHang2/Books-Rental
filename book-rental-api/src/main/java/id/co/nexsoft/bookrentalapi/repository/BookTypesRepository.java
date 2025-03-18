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

import id.co.nexsoft.bookrentalapi.dto.BookTypesDTO;
import id.co.nexsoft.bookrentalapi.model.BookTypes;

@Repository
public interface BookTypesRepository extends JpaRepository<BookTypes, Integer> {
	@Query(value = "SELECT bt.id, bt.name, bt.code, bt.delete_date "
					+ "FROM book_types bt "
					+ "WHERE bt.delete_date is null "
					+ "ORDER BY bt.name"
					, nativeQuery=true)
	List<BookTypes> getAllBookType();
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.BookTypesDTO "
			+ "(bt.id, bt.name, bt.code, bt.deleteDate, COUNT(b.type)) "
			+ "FROM Books b "
			+ "RIGHT JOIN b.type bt "
			+ "WHERE b.deleteDate is null "
			+ "AND bt.deleteDate is null "
			+ "AND bt.name LIKE %:key% "
			+ "GROUP BY b.type "
			+ "ORDER BY bt.name")
	List<BookTypesDTO> searchBookTypesByName(@Param("key") String key);
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.BookTypesDTO "
			+ "(bt.id, bt.name, bt.code, bt.deleteDate, COUNT(b.type)) "
			+ "FROM Books b "
			+ "RIGHT JOIN b.type bt "
			+ "WHERE b.deleteDate is null "
			+ "AND bt.deleteDate is null "
			+ "AND bt.name LIKE %:key% "
			+ "GROUP BY b.type "
			+ "ORDER BY bt.name")
	Page<BookTypesDTO> searchBookTypesByNamePagination(@Param("key") String key, Pageable pageable);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE book_types bt "
					+ "SET bt.name = :name "
					+ "WHERE bt.id = :id"
					, nativeQuery = true)
	void updateBookTypes(@Param("id") int id, @Param("name") String name);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE book_types bt "
					+ "SET bt.delete_date = :deleteDate "
					+ "WHERE bt.id = :id"
					, nativeQuery = true)
	void deleteBookTypes(@Param("id") int id, @Param("deleteDate") Date deleteDate);
}
