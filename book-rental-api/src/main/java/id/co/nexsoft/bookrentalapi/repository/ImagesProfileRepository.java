package id.co.nexsoft.bookrentalapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import id.co.nexsoft.bookrentalapi.model.ImagesProfile;

@Repository
public interface ImagesProfileRepository extends JpaRepository<ImagesProfile, Integer> {
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO images_profile (user_id) VALUES (:userId)", nativeQuery=true)
	void addImageProfileUserId(@Param("userId") int userId);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE images_profile impf "
					+ "SET impf.file_data = :fileData, impf.file_name = :fileName, impf.file_type = :fileType "
					+ "WHERE impf.user_id = :userId"
					, nativeQuery=true)
	void editImageProfileByUserId(@Param("fileData") byte[] fileData, 
			@Param("fileName") String fileName, @Param("fileType") String fileType, 
			@Param("userId") int userId);
	
	@Query(value ="SELECT impf.id, impf.file_data, impf.file_name, impf.file_type, impf.user_id "
					+ "FROM images_profile impf "
					+ "WHERE impf.user_id = :userId"
					, nativeQuery = true)
	ImagesProfile getImageProfileByUserId(@Param("userId") int userId);
}
