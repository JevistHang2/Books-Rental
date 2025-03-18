package id.co.nexsoft.bookrentalapi.dto;

import java.util.Date;

public class RentalsHistoryDTO {
	private int userId;
	private int rentalId;
	private String firstName;
	private String lastName;
	private Date startRentalDate;
	private long bookCount;
	private long allTotalPrice;
	
	public RentalsHistoryDTO() {
	}

	public RentalsHistoryDTO(int userId, int rentalId, String firstName, String lastName, Date startRentalDate,
			long bookCount, long allTotalPrice) {
		this.userId = userId;
		this.rentalId = rentalId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.startRentalDate = startRentalDate;
		this.bookCount = bookCount;
		this.allTotalPrice = allTotalPrice;
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

	public long getBookCount() {
		return bookCount;
	}

	public void setBookCount(long bookCount) {
		this.bookCount = bookCount;
	}

	public long getAllTotalPrice() {
		return allTotalPrice;
	}

	public void setAllTotalPrice(long allTotalPrice) {
		this.allTotalPrice = allTotalPrice;
	}

	
}
