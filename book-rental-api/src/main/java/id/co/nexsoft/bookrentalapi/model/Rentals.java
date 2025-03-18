package id.co.nexsoft.bookrentalapi.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Rentals {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private Users userId;
	private Date startRentalDate;

	public Rentals() {
	}

	public Rentals(Users userId, Date startRentalDate) {
		this.userId = userId;
		this.startRentalDate = startRentalDate;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Users getUserId() {
		return userId;
	}

	public void setUserId(Users userId) {
		this.userId = userId;
	}

	public Date getStartRentalDate() {
		return startRentalDate;
	}

	public void setStartRentalDate(Date startRentalDate) {
		this.startRentalDate = startRentalDate;
	}
}
