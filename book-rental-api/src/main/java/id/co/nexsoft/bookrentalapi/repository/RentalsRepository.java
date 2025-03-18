package id.co.nexsoft.bookrentalapi.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import id.co.nexsoft.bookrentalapi.model.Rentals;

@Repository
public interface RentalsRepository extends JpaRepository<Rentals, Integer>{
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO rentals (start_rental_date, user_id) "
					+ "VALUES (:startRentalDate, :userId)"
					, nativeQuery = true)
	void addRental(@Param("startRentalDate") Date startRentalDate, @Param("userId") int userId);
	
	@Query(value = "SELECT re.id, re.user_id ,re.start_rental_date "
					+ "FROM rentals re "
					+ "WHERE re.start_rental_date = :dateNow "
					+ "AND re.user_id = :userId"
					, nativeQuery = true)
	Rentals getRentalById(@Param("dateNow") Date dateNow, @Param("userId") int userId);
}
