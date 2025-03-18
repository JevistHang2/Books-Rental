package id.co.nexsoft.bookrentalapi.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.nexsoft.bookrentalapi.config.SpringSecurityConfiguration;
import id.co.nexsoft.bookrentalapi.dto.ChangePasswordRequestDTO;
import id.co.nexsoft.bookrentalapi.dto.EditUserDTO;
import id.co.nexsoft.bookrentalapi.dto.StaffRegisterDTO;
import id.co.nexsoft.bookrentalapi.dto.UsersRegisterDTO;
import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.repository.ImagesProfileRepository;
import id.co.nexsoft.bookrentalapi.repository.UsersRepository;
import id.co.nexsoft.bookrentalapi.util.PasswordGenerator;

@Service
public class UsersService {
	@Autowired
	private SpringSecurityConfiguration springSecurityConfiguration;

	@Autowired
	private UsersRepository usersRepo;

	@Autowired
	private ImagesProfileRepository imagesProfileRepo;

	@Autowired
	private EmailService emailService;
	
	@Autowired
	private PasswordGenerator passwordGenerator;

	public Users getUserByUserName(String userName) {
		return usersRepo.findByuserName(userName);
	}

	public ResponseEntity<?> getUsersByRoleMemberAndUserById(int id) {
		return ResponseEntity.ok().body(usersRepo.getUsersByRoleMemberAndUserById(id));
	}

	public ResponseEntity<?> searchUsersByRoleAdminAndStaffByNameOrUsername(String key) {
		return ResponseEntity.ok().body(usersRepo.searchUsersByRoleAdminAndStaffByNameOrUsername(key));
	}

	public ResponseEntity<?> searchUsersByRoleMemberAndUserByNameOrUsername(String key) {
		return ResponseEntity.ok().body(usersRepo.searchUsersByRoleMemberAndUserByNameOrUsername(key));
	}

	// Pagination
	public ResponseEntity<?> searchUsersByRoleAdminAndStaffByNameOrUsernamePagination(String key, int pageNo,
			int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok()
				.body(usersRepo.searchUsersByRoleAdminAndStaffByNameOrUsernamePagination(key, pageable));
	}

	public ResponseEntity<?> searchUsersByRoleMemberAndUserByNameOrUsernamePagination(String key, int pageNo,
			int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok()
				.body(usersRepo.searchUsersByRoleMemberAndUserByNameOrUsernamePagination(key, pageable));
	}
	// End Pagination

	@Transactional
	public ResponseEntity<?> regiterUser(UsersRegisterDTO user) {
		if (usersRepo.existsByemail(user.getEmail())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email is already in use!");
		} else if (usersRepo.existsByuserName(user.getUserName())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Username is already taken!");
		} else if (usersRepo.existsByphoneNumber(user.getPhoneNumber())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Phone Number is already in use!");
		} else {
			Users newUser = new Users();
			newUser.setFirstName(user.getFirstName());
			newUser.setLastName(user.getLastName());
			newUser.setEmail(user.getEmail());
			newUser.setUserName(user.getUserName());
			newUser.setPassword(springSecurityConfiguration.passwordEncoder().encode(user.getPassword()));
			newUser.setAddress(user.getAddress());
			newUser.setPhoneNumber(user.getPhoneNumber());
			newUser.setRole("ROLE_USER");
			newUser.setRegistrationDate(new Date());

			Users getUserId = usersRepo.save(newUser);
			imagesProfileRepo.addImageProfileUserId(getUserId.getId());

			return ResponseEntity.ok().body("Register success");
		}
	}

	@Transactional
	public ResponseEntity<?> regiterStaff(StaffRegisterDTO user) {
		if (usersRepo.existsByemail(user.getEmail())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email is already in use!");
		} else if (usersRepo.existsByuserName(user.getUserName())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Username is already taken!");
		} else if (usersRepo.existsByphoneNumber(user.getPhoneNumber())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Phone Number is already in use!");
		} else {
			String defaultPassword = passwordGenerator.generatePassword(8);
			String defaultRole = "ROLE_STAFF";

			Users newUser = new Users();
			newUser.setFirstName(user.getFirstName());
			newUser.setLastName(user.getLastName());
			newUser.setEmail(user.getEmail());
			newUser.setUserName(user.getUserName());
			newUser.setPassword(springSecurityConfiguration.passwordEncoder().encode(defaultPassword));
			newUser.setAddress(user.getAddress());
			newUser.setPhoneNumber(user.getPhoneNumber());
			newUser.setRole(defaultRole);
			newUser.setRegistrationDate(new Date());

			Users getUserId = usersRepo.save(newUser);
			imagesProfileRepo.addImageProfileUserId(getUserId.getId());

			// Email Service Send Information
			String emailTo = user.getEmail();
			String subject = "STAFF REGISTRATION SUCCESS INFORMATION";
			String textBody = "You're become one of the STAFF with NEXBOOK!! \n"
					+ "Your Register Information are Below: \n\n"
					+ "Firstname : " + user.getFirstName() + "\n" 
					+ "Lastname : " + user.getLastName() + "\n"
					+ "Email : " + user.getEmail() + "\n"
					+ "Address : " + user.getAddress() + "\n"
					+ "Phone : " + user.getPhoneNumber() + "\n\n"
					+ "Please use your username & default password below to Login: \n"
					+ "Username : " + user.getUserName() + "\n"
					+ "Password : " + defaultPassword + "\n\n"
					+ "Don't Forget to Change Your Password After Login!";

			emailService.sendEmail(emailTo, subject, textBody);
			// End Email Service

			return ResponseEntity.ok().body("Register Staff Success");
		}
	}

	public ResponseEntity<?> getUsersByAdminAndStaff() {
		return ResponseEntity.ok().body(usersRepo.getUsersByRoleAdminAndStaff());
	}

	public ResponseEntity<?> getUsersByMemberAndUser() {
		return ResponseEntity.ok().body(usersRepo.getUsersByRoleMemberAndUser());
	}

	public ResponseEntity<?> deleteStaff(Users user) {
		Date deleteDate = new Date();
		usersRepo.deleteStaff(user.getId(), deleteDate);
		return ResponseEntity.ok().body("Success Delete Staff");
	}

	public ResponseEntity<?> updateUserData(EditUserDTO user) {
		usersRepo.updateUserData(user.getId(), user.getFirstName(), user.getLastName(), user.getAddress(),
				user.getPhoneNumber(), user.getEmail());
		return ResponseEntity.ok().body("Success Edited User");
	}

	public ResponseEntity<?> updateCustomerRole(Users user) {
		String role = null;
		if (user.getRole().equals("ROLE_MEMBER")) {
			role = "ROLE_MEMBER";
		} else {
			role = "ROLE_USER";
		}
		usersRepo.updateCustomerRole(user.getId(), role);
		return ResponseEntity.ok()
				.body("Success Change Role Customer \n" + "Please Inform The User Re-Login To Get The Effect");
	}

	public ResponseEntity<?> updateUserPassword(ChangePasswordRequestDTO changePasswordRequest) {
		ResponseEntity<?> response = null;
		Users user = usersRepo.getUserById(changePasswordRequest.getUserId());
		boolean isPasswordMatch = springSecurityConfiguration.passwordEncoder()
				.matches(changePasswordRequest.getCurrentPassword(), user.getPassword());

		if (!isPasswordMatch) {
			response = ResponseEntity.badRequest().body("Your Current Password is Wrong");
		} else if (changePasswordRequest.getNewPassword().equals(changePasswordRequest.getRenewPassword())) {
			usersRepo.updateUserPassword(user.getId(),
					springSecurityConfiguration.passwordEncoder().encode(changePasswordRequest.getNewPassword()));
			response = ResponseEntity.ok().body("Success Change Password");
		} else if (!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getRenewPassword())) {
			response = ResponseEntity.badRequest().body("New Password & Retype Password Not Match");
		} else {
			response = ResponseEntity.badRequest().body("Password Not Change");
		}
		return response;
	}
}
