package id.co.nexsoft.bookrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import id.co.nexsoft.bookrentalapi.model.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Integer> {
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO images (file_data, file_name, file_type, book_id) "
					+ "VALUES (:fileData, :fileName, :fileType, :bookId)"
					, nativeQuery=true)
	void addImages(@Param("fileData") byte[] fileData, @Param("fileName") String fileName, 
			@Param("fileType") String fileType, @Param("bookId") int bookId);
	
	@Query(value ="SELECT im.id, im.file_data, im.file_name, im.file_type, im.book_id "
					+ "FROM images im "
					+ "WHERE im.book_id = :bookId"
					, nativeQuery = true)
	Images getImageBybookId(@Param("bookId") int id);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE images im "
					+ "SET im.file_data = :fileData, im.file_name = :fileName, "
					+ "im.file_type = :fileType "
					+ "WHERE im.book_id = :bookId"
					, nativeQuery=true)
	void editImageByBookId(@Param("fileData") byte[] fileData, @Param("fileName") String fileName, 
			@Param("fileType") String fileType, @Param("bookId") int bookId);
}
