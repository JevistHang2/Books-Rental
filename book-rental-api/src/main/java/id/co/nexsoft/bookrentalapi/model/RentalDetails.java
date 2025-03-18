package id.co.nexsoft.bookrentalapi.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class RentalDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@ManyToOne
	@JoinColumn(name = "rental_id")
	private Rentals rentalId;
	@ManyToOne
	@JoinColumn(name = "book_id")
	private Books bookId;
	@Column(nullable = true)
	private Date endRentalDate;
	private long rentalPrice;
	@Column(nullable = true, columnDefinition = "bigint default 0")
	private long finePrice;
	@Column(nullable = true, columnDefinition = "bigint default 0")
	private long totalPrice;
	private String statusRental;
	
	public RentalDetails() {
	}
	
	public RentalDetails(Rentals rentalId, Books bookId, Date endRentalDate, long rentalPrice,
			long finePrice, long totalPrice, String statusRental) {
		this.rentalId = rentalId;
		this.bookId = bookId;
		this.endRentalDate = endRentalDate;
		this.rentalPrice = rentalPrice;
		this.finePrice = finePrice;
		this.totalPrice = totalPrice;
		this.statusRental = statusRental;
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Rentals getRentalId() {
		return rentalId;
	}
	public void setRentalId(Rentals rentalId) {
		this.rentalId = rentalId;
	}
	public Books getBookId() {
		return bookId;
	}
	public void setBookId(Books bookId) {
		this.bookId = bookId;
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
}
