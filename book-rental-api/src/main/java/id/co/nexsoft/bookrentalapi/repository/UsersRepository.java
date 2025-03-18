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

import id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO;
import id.co.nexsoft.bookrentalapi.model.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Integer> {
	Users findByuserName(String username);

	Boolean existsByuserName(String username);

	Boolean existsByemail(String email);

	Boolean existsByphoneNumber(String phoneNumber);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE (u.role = 'ROLE_ADMIN' OR u.role = 'ROLE_STAFF') "
			+ "AND u.deleteDate is null "
			+ "ORDER BY u.role , u.firstName")
	List<UsersLoginResponseDTO> getUsersByRoleAdminAndStaff();
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE (u.role = 'ROLE_ADMIN' OR u.role = 'ROLE_STAFF') "
			+ "AND u.deleteDate is null "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR u.userName LIKE %:key%) "
			+ "ORDER BY u.role , u.firstName")
	List<UsersLoginResponseDTO> searchUsersByRoleAdminAndStaffByNameOrUsername(@Param("key") String key);

	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE (u.role = 'ROLE_MEMBER' OR u.role = 'ROLE_USER') "
			+ "AND u.deleteDate is null "
			+ "ORDER BY u.firstName")
	List<UsersLoginResponseDTO> getUsersByRoleMemberAndUser();
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE (u.role = 'ROLE_MEMBER' OR u.role = 'ROLE_USER') "
			+ "AND u.deleteDate is null "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR u.userName LIKE %:key%) "
			+ "ORDER BY u.firstName")
	List<UsersLoginResponseDTO> searchUsersByRoleMemberAndUserByNameOrUsername(@Param("key") String key);
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE u.deleteDate is null "
			+ "AND u.id = :id")
	UsersLoginResponseDTO getUsersByRoleMemberAndUserById(@Param("id") int id);
	
	@Query(value ="SELECT u.id, u.user_name, u.first_name, u.last_name, u.password, "
			+ "u.address, u.phone_number, u.email, u.role, u.registration_date, u.delete_date "
			+ "FROM users u "
			+ "WHERE u.delete_date is null "
			+ "AND u.id = :id"
			, nativeQuery = true)
	Users getUserById(@Param("id") int id);
	
	//Pagination
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE (u.role = 'ROLE_ADMIN' OR u.role = 'ROLE_STAFF') "
			+ "AND u.deleteDate is null "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR u.userName LIKE %:key%) "
			+ "ORDER BY u.role , u.firstName")
	Page<UsersLoginResponseDTO> searchUsersByRoleAdminAndStaffByNameOrUsernamePagination(@Param("key") String key, 
			Pageable pageable);
	
	@Query("SELECT new id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO "
			+ "(u.id, u.userName, u.firstName, u.lastName, u.address, u.phoneNumber, "
			+ "u.email, u.role, u.registrationDate, u.deleteDate ) "
			+ "FROM Users u "
			+ "WHERE (u.role = 'ROLE_MEMBER' OR u.role = 'ROLE_USER') "
			+ "AND u.deleteDate is null "
			+ "AND (CONCAT(Ifnull(u.firstName,' ') ,' ', Ifnull(u.lastName,' ')) LIKE %:key% "
			+ "OR u.userName LIKE %:key%) "
			+ "ORDER BY u.firstName")
	Page<UsersLoginResponseDTO> searchUsersByRoleMemberAndUserByNameOrUsernamePagination(@Param("key") String key, 
			Pageable pageable);

	@Transactional
	@Modifying
	@Query(value = "UPDATE users u SET u.delete_date = :deleteDate WHERE u.id = :id", nativeQuery = true)
	void deleteStaff(@Param("id") int id, @Param("deleteDate") Date deleteDate);

	@Transactional
	@Modifying
	@Query(value = "UPDATE users u "
			+ "SET u.first_name = :firstName, u.last_name = :lastName, "
			+ "u.address = :address, u.phone_number = :phoneNumber, u.email = :email "
			+ "WHERE u.id = :id"
			, nativeQuery = true)
	void updateUserData(@Param("id") int id, @Param("firstName") String firstName, @Param("lastName") String lastName,
			@Param("address") String address, @Param("phoneNumber") String phoneNumber, @Param("email") String email);

	@Transactional
	@Modifying
	@Query(value = "UPDATE users u SET u.role = :role WHERE u.id = :id", nativeQuery = true)
	void updateCustomerRole(@Param("id") int id, @Param("role") String role);
	
	@Transactional
	@Modifying
	@Query(value = "UPDATE users u SET u.password = :password WHERE u.id = :userId", nativeQuery = true)
	void updateUserPassword(@Param("userId") int userId, @Param("password") String password);
}
