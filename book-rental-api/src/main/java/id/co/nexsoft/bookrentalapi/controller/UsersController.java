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

import id.co.nexsoft.bookrentalapi.authentication.AuthenticationRequest;
import id.co.nexsoft.bookrentalapi.dto.ChangePasswordRequestDTO;
import id.co.nexsoft.bookrentalapi.dto.EditUserDTO;
import id.co.nexsoft.bookrentalapi.dto.StaffRegisterDTO;
import id.co.nexsoft.bookrentalapi.dto.UsersRegisterDTO;
import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.service.AuthenticationService;
import id.co.nexsoft.bookrentalapi.service.UsersService;

@RestController
@RequestMapping("api/")
public class UsersController {
	@Autowired
	private UsersService usersService;

	@Autowired
	private AuthenticationService authenticationService;

	@PostMapping("/user/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody UsersRegisterDTO user) throws Exception {
		return usersService.regiterUser(user);
	}

	@PostMapping("/admin/registerstaff")
	public ResponseEntity<?> registerStaff(@Valid @RequestBody StaffRegisterDTO user) throws Exception {
		return usersService.regiterStaff(user);
	}

	@PostMapping("/admin/edituser")
	public ResponseEntity<?> edituser(@Valid @RequestBody EditUserDTO user) throws Exception {
		return usersService.updateUserData(user);
	}

	@PostMapping("/user/edituser")
	public ResponseEntity<?> edituserforcustomer(@Valid @RequestBody EditUserDTO user) throws Exception {
		return usersService.updateUserData(user);
	}

	@PostMapping("/admin/editcustomerrole")
	public ResponseEntity<?> updateCustomerRole(@RequestBody Users user) throws Exception {
		return usersService.updateCustomerRole(user);
	}

	@PostMapping("/admin/deletestaff")
	public ResponseEntity<?> deleteStaff(@RequestBody Users user) throws Exception {
		return usersService.deleteStaff(user);
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@Valid @RequestBody AuthenticationRequest authenticationRequest)
			throws Exception {
		return authenticationService.loginUser(authenticationRequest);
	}

	@GetMapping("/admin/getadminandstaff")
	public ResponseEntity<?> getUsersByAdminAndStaff() {
		return usersService.getUsersByAdminAndStaff();
	}

	@GetMapping("/admin/getmemberanduser")
	public ResponseEntity<?> getUsersByMemberAndUser() {
		return usersService.getUsersByMemberAndUser();
	}

	@GetMapping("/admin/getmemberanduser/id={id}")
	public ResponseEntity<?> getUsersByMemberAndUserById(@PathVariable("id") int id) {
		return usersService.getUsersByRoleMemberAndUserById(id);
	}

	@GetMapping("/admin/getadminandstaff/key={key}")
	public ResponseEntity<?> searchUsersByRoleAdminAndStaffByNameOrUsername(@PathVariable("key") String key) {
		return usersService.searchUsersByRoleAdminAndStaffByNameOrUsername(key);
	}

	@GetMapping("/admin/getmemberanduser/key={key}")
	public ResponseEntity<?> searchUsersByRoleMemberAndUserByNameOrUsername(@PathVariable("key") String key) {
		return usersService.searchUsersByRoleMemberAndUserByNameOrUsername(key);
	}

	@PostMapping("/edituserpassword")
	public ResponseEntity<?> updateUserPassword(@Valid @RequestBody ChangePasswordRequestDTO changePasswordRequest) {
		return usersService.updateUserPassword(changePasswordRequest);
	}

	@GetMapping("/admin/getadminandstaffpagination/key={key}")
	public ResponseEntity<?> searchUsersByRoleAdminAndStaffByNameOrUsernamePagination(@PathVariable("key") String key,
			@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "5") Integer pageSize) {
		return usersService.searchUsersByRoleAdminAndStaffByNameOrUsernamePagination(key, pageNo, pageSize);
	}

	@GetMapping("/admin/getmemberanduserpagination/key={key}")
	public ResponseEntity<?> searchUsersByRoleMemberAndUserByNameOrUsernamePagination(@PathVariable("key") String key,
			@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "5") Integer pageSize) {
		return usersService.searchUsersByRoleMemberAndUserByNameOrUsernamePagination(key, pageNo, pageSize);
	}
}
