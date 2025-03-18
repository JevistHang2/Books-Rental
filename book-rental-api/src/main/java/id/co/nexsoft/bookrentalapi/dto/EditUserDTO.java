package id.co.nexsoft.bookrentalapi.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class EditUserDTO {
	private int id;

	@NotBlank
	private String firstName;
	@NotBlank
	private String lastName;
	@NotBlank
	private String address;
	@NotBlank
	private String phoneNumber;
	@NotBlank
	@Email(message = "Please Enter A Valid Email Address")
	private String email;

	public EditUserDTO() {
	}

	public EditUserDTO(int id, @NotBlank String firstName, @NotBlank String lastName, @NotBlank String address,
			@NotBlank String phoneNumber,
			@NotBlank @Email(message = "Please Enter A Valid Email Address") String email) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.email = email;
	}



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
