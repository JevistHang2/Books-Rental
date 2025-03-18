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

import id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO;
import id.co.nexsoft.bookrentalapi.dto.RentalsDTO;
import id.co.nexsoft.bookrentalapi.dto.RentalsHistoryDTO;
import id.co.nexsoft.bookrentalapi.model.RentalDetails;

@Repository
public interface RentalDetailsRepository extends JpaRepository<RentalDetails, Integer> {
	@Transactional
	@Modifying
	@Query(value = "INSERT INTO rental_details (rental_id, book_id, rental_price, status_rental) "
					+ "VALUES (:rentalId, :bookId, :rentalPrice, :statusRental)"
					, nativeQuery = true)
	void addRental(@Param("rentalId") int rentalId, @Param("bookId") int bookId, @Param("rentalPrice") long rentalPrice,
			@Param("statusRental") String statusRental);

	// Get Rental For Role ADMIN & STAFF
	@Query("SELECT DISTINCT new id.co.nexsoft.bookrentalapi.dto.RentalsDTO "
			+ "(u.id, r.id, u.firstName, u.lastName, r.startRentalDate) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RENTAL' "
			+ "ORDER BY DATE(r.startRentalDate), TIME(r.startRentalDate)")
	List<RentalsDTO> getUserRental();

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalsDTO "
			+ "(u.id, r.id, u.firstName, u.lastName, r.startRentalDate) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RENTAL' "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key%) "
			+ "GROUP BY r.startRentalDate "
			+ "ORDER BY DATE(r.startRentalDate), TIME(r.startRentalDate)")
	List<RentalsDTO> searchUserRentalByName(@Param("key") String key);

	// Pagination
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalsDTO "
			+ "(u.id, r.id, u.firstName, u.lastName, r.startRentalDate) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RENTAL' "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key%) "
			+ "GROUP BY r.startRentalDate "
			+ "ORDER BY DATE(r.startRentalDate) DESC, TIME(r.startRentalDate) DESC")
	Page<RentalsDTO> searchUserRentalByNamePagination(@Param("key") String key, Pageable pageable);
	// End Pagination

	// Get Rental Details used by Role ADMIN & STAFF
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE r.id = :rentalId "
			+ "AND rd.statusRental = 'RENTAL'")
	List<RentalDetailsDTO> getUserRentalDetailsByRentalId(@Param("rentalId") int rentalId);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE u.id = :userId "
			+ "AND rd.statusRental = 'RENTAL'")
	List<RentalDetailsDTO> getUserRentalDetailsByUserId(@Param("userId") int userId);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalsHistoryDTO "
			+ "(u.id, r.id, u.firstName, u.lastName, r.startRentalDate, COUNT(b.id), SUM(rd.totalPrice)) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RETURN' "
			+ "GROUP BY rd.rentalId "
			+ "ORDER BY DATE(r.startRentalDate) DESC, TIME(r.startRentalDate) DESC")
	List<RentalsHistoryDTO> getRentalHistory();

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalsHistoryDTO "
			+ "(u.id, r.id, u.firstName, u.lastName, r.startRentalDate, COUNT(b.id), SUM(rd.totalPrice)) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RETURN' "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR b.title LIKE %:key% "
			+ "OR DATE(r.startRentalDate) LIKE %:key%) "
			+ "GROUP BY rd.rentalId "
			+ "ORDER BY DATE(r.startRentalDate) DESC, TIME(r.startRentalDate) DESC")
	List<RentalsHistoryDTO> searchRentalHistoryByNameOrBookOrDate(@Param("key") String key);
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RETURN' "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR b.title LIKE %:key% "
			+ "OR DATE(r.startRentalDate) LIKE %:key%) "
			+ "ORDER BY DATE(r.startRentalDate) DESC, TIME(r.startRentalDate) DESC")
	List<RentalDetailsDTO> searchAllDetailRentalHistoryByNameOrBookOrDateForPDF(@Param("key") String key);

	// Pagination
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalsHistoryDTO "
			+ "(u.id, r.id, u.firstName, u.lastName, r.startRentalDate, COUNT(b.id), SUM(rd.totalPrice)) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE rd.statusRental = 'RETURN' "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR b.title LIKE %:key% "
			+ "OR DATE(r.startRentalDate) LIKE %:key%) "
			+ "GROUP BY rd.rentalId "
			+ "ORDER BY DATE(rd.endRentalDate) DESC, TIME(rd.endRentalDate) DESC")
	Page<RentalsHistoryDTO> searchRentalHistoryByNameOrBookOrDatePagination(@Param("key") String key, Pageable pageable);
	// End Pagination

	// Get Rental Details used by Role USER & MEMBER
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE r.id = :rentalId "
			+ "AND rd.statusRental = 'RETURN'")
	List<RentalDetailsDTO> getRentalDetailsHistory(@Param("rentalId") int rentalId);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE u.id = :userId "
			+ "AND rd.statusRental = 'RETURN' "
			+ "ORDER BY DATE(rd.endRentalDate) DESC, TIME(rd.endRentalDate) DESC")
	List<RentalDetailsDTO> getRentalDetailsHistoryByUserId(@Param("userId") int userId);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE u.id = :userId "
			+ "AND rd.statusRental = 'RETURN' "
			+ "AND (b.title LIKE %:key% OR DATE(r.startRentalDate) LIKE %:key% "
			+ "OR DATE(rd.endRentalDate) LIKE %:key%) "
			+ "ORDER BY DATE(rd.endRentalDate) DESC, TIME(rd.endRentalDate) DESC")
	List<RentalDetailsDTO> searchRentalDetailsHistoryByUserIdWithNameOrBookOrDate(@Param("userId") int userId,
			@Param("key") String key);
	
	//Pagination
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO "
			+ "(u.id, b.id, bt.id, r.id, rd.id, b.title, bt.name, r.startRentalDate, rd.endRentalDate, "
			+ "rd.rentalPrice, rd.finePrice, rd.totalPrice, rd.statusRental, u.firstName, u.lastName) "
			+ "FROM RentalDetails rd "
			+ "JOIN rd.rentalId r JOIN r.userId u JOIN rd.bookId b JOIN b.type bt "
			+ "WHERE u.id = :userId "
			+ "AND rd.statusRental = 'RETURN' "
			+ "AND (b.title LIKE %:key% OR DATE(r.startRentalDate) LIKE %:key% "
			+ "OR DATE(rd.endRentalDate) LIKE %:key%) "
			+ "ORDER BY DATE(rd.endRentalDate) DESC, TIME(rd.endRentalDate) DESC")
	Page<RentalDetailsDTO> searchRentalDetailsHistoryByUserIdWithNameOrBookOrDatePagination(@Param("userId") int userId,
			@Param("key") String key, Pageable pageable);
	//End Pagination

	// Dashboard Data Admin
	@Query(value = "SELECT COUNT(rd.book_id) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RENTAL' "
			+ "AND MONTH(r.start_rental_date) = MONTH(CURRENT_DATE()) "
			+ "AND YEAR(r.start_rental_date) = YEAR(CURRENT_DATE())"
			, nativeQuery = true)
	long countRentaledBookThisMonthAdmin();

	@Query(value = "SELECT COUNT(rd.book_id) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RETURN' "
			+ "AND MONTH(rd.end_rental_date) = MONTH(CURRENT_DATE()) "
			+ "AND YEAR(rd.end_rental_date) = YEAR(CURRENT_DATE())"
			, nativeQuery = true)
	long countReturnBookThisMonthAdmin();

	@Query(value = "SELECT SUM(rd.total_price) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RETURN' "
			+ "AND MONTH(rd.end_rental_date) = MONTH(CURRENT_DATE()) "
			+ "AND YEAR(rd.end_rental_date) = YEAR(CURRENT_DATE())"
			, nativeQuery = true)
	long sumIncomeThisMonthAdmin();
	// End Dashboard Data Admin

	// Dashboard Data User
	@Query(value = "SELECT COUNT(rd.book_id) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RETURN' "
			+ "AND MONTH(rd.end_rental_date) = MONTH(CURRENT_DATE()) "
			+ "AND YEAR(rd.end_rental_date) = YEAR(CURRENT_DATE()) "
			+ "AND user_id = :userId"
			, nativeQuery = true)
	long countRentaledBookThisMonthUser(@Param("userId") int userId);

	@Query(value = "SELECT COUNT(rd.book_id) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RENTAL' "
			+ "AND MONTH(r.start_rental_date) = MONTH(CURRENT_DATE()) "
			+ "AND YEAR(r.start_rental_date) = YEAR(CURRENT_DATE()) "
			+ "AND user_id = :userId"
			, nativeQuery = true)
	long countBookOnRentalThisMonthUser(@Param("userId") int userId);

	@Query(value = "SELECT SUM(rd.total_price) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RETURN' "
			+ "AND MONTH(rd.end_rental_date) = MONTH(CURRENT_DATE()) "
			+ "AND YEAR(rd.end_rental_date) = YEAR(CURRENT_DATE()) "
			+ "AND r.user_id = :userId"
			, nativeQuery = true)
	long sumIncomeThisMonthUser(@Param("userId") int userId);
	// End Dashboard Data User
	
	// Count Book Type Rental User From Database
	@Query(value = "SELECT COUNT(bt.name) "
			+ "FROM rental_details rd "
			+ "LEFT JOIN rentals r ON rd.rental_id = r.id LEFT JOIN books b ON rd.book_id = b.id "
			+ "LEFT JOIN book_types bt ON b.type_id = bt.id LEFT JOIN users u ON r.user_id = u.id "
			+ "WHERE rd.status_rental = 'RENTAL' "
			+ "AND r.user_id = :userId "
			+ "AND (bt.name LIKE :typeName)", nativeQuery = true)
	long countBookTypeOnRentalByUserAndType(@Param("userId") int userId, 
			@Param("typeName") String typeName);

	@Transactional
	@Modifying
	@Query(value = "UPDATE rental_details rd "
			+ "SET rd.end_rental_date = :endRentalDate, rd.fine_price = :finePrice, "
			+ "rd.total_price = :totalPrice, rd.status_rental = :statusRental "
			+ "WHERE rd.id = :id"
			, nativeQuery = true)
	void updateRentalDetailsById(@Param("id") int id, @Param("endRentalDate") Date endRentalDate,
			@Param("finePrice") long finePrice, @Param("totalPrice") long totalPrice,
			@Param("statusRental") String statusRental);
}
