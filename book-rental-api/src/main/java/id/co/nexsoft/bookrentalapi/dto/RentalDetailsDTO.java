package id.co.nexsoft.bookrentalapi.dto;

import java.util.Date;

public class RentalDetailsDTO {
	private int usersId;
	private int booksId;
	private int bookTypesId;
	private int rentalsId;
	private int rentalDetailsId;
	
	private String bookTitles;
	private String bookTypesName;
	private Date startRentalDate;
	private Date endRentalDate;
	private long rentalPrice;
	private long finePrice;
	private long totalPrice;
	private String statusRental;
	private String usersFirstName;
	private String usersLastName;
	
	public RentalDetailsDTO() {
	}
	
	public RentalDetailsDTO(int usersId, int booksId, int bookTypesId, int rentalsId, int rentalDetailsId,
			String bookTitles, String bookTypesName, Date startRentalDate, Date endRentalDate, long rentalPrice,
			long finePrice, long totalPrice, String statusRental, String usersFirstName, String usersLastName) {
		this.usersId = usersId;
		this.booksId = booksId;
		this.bookTypesId = bookTypesId;
		this.rentalsId = rentalsId;
		this.rentalDetailsId = rentalDetailsId;
		this.bookTitles = bookTitles;
		this.bookTypesName = bookTypesName;
		this.startRentalDate = startRentalDate;
		this.endRentalDate = endRentalDate;
		this.rentalPrice = rentalPrice;
		this.finePrice = finePrice;
		this.totalPrice = totalPrice;
		this.statusRental = statusRental;
		this.usersFirstName = usersFirstName;
		this.usersLastName = usersLastName;
	}

	public int getUsersId() {
		return usersId;
	}
	public void setUsersId(int usersId) {
		this.usersId = usersId;
	}
	public int getBooksId() {
		return booksId;
	}
	public void setBooksId(int booksId) {
		this.booksId = booksId;
	}
	public int getBookTypesId() {
		return bookTypesId;
	}
	public void setBookTypesId(int bookTypesId) {
		this.bookTypesId = bookTypesId;
	}
	public int getRentalsId() {
		return rentalsId;
	}
	public void setRentalsId(int rentalsId) {
		this.rentalsId = rentalsId;
	}
	public int getRentalDetailsId() {
		return rentalDetailsId;
	}
	public void setRentalDetailsId(int rentalDetailsId) {
		this.rentalDetailsId = rentalDetailsId;
	}
	public String getBookTitles() {
		return bookTitles;
	}
	public void setBookTitles(String bookTitles) {
		this.bookTitles = bookTitles;
	}
	public String getBookTypesName() {
		return bookTypesName;
	}
	public void setBookTypesName(String bookTypesName) {
		this.bookTypesName = bookTypesName;
	}
	public Date getStartRentalDate() {
		return startRentalDate;
	}
	public void setStartRentalDate(Date startRentalDate) {
		this.startRentalDate = startRentalDate;
	}
	public Date getEndRentalDate() {
		return endRentalDate;
	}
	public void setEndRentalDate(Date endRentalDate) {
		this.endRentalDate = endRentalDate;
	}
	public long getRentalPrice() {
		return rentalPrice;
	}
	public void setRentalPrice(long rentalPrice) {
		this.rentalPrice = rentalPrice;
	}
	public long getFinePrice() {
		return finePrice;
	}
	public void setFinePrice(long finePrice) {
		this.finePrice = finePrice;
	}
	public long getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}
	public String getStatusRental() {
		return statusRental;
	}
	public void setStatusRental(String statusRental) {
		this.statusRental = statusRental;
	}
	public String getUsersFirstName() {
		return usersFirstName;
	}
	public void setUsersFirstName(String usersFirstName) {
		this.usersFirstName = usersFirstName;
	}
	public String getUsersLastName() {
		return usersLastName;
	}
	public void setUsersLastName(String usersLastName) {
		this.usersLastName = usersLastName;
	}
}
