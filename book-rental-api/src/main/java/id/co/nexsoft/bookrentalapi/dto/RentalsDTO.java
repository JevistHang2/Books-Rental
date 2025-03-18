package id.co.nexsoft.bookrentalapi.dto;

import java.util.Date;

public class RentalsDTO {
	private int userId;
	private int rentalId;
	private String firstName;
	private String lastName;
	private Date startRentalDate;
	
	public RentalsDTO() {
	}

	public RentalsDTO(int userId, int rentalId, String firstName, String lastName, Date startRentalDate) {
		this.userId = userId;
		this.rentalId = rentalId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.startRentalDate = startRentalDate;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getRentalId() {
		return rentalId;
	}

	public void setRentalId(int rentalId) {
		this.rentalId = rentalId;
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

	public Date getStartRentalDate() {
		return startRentalDate;
	}

	public void setStartRentalDate(Date startRentalDate) {
		this.startRentalDate = startRentalDate;
	}

	
	
}
