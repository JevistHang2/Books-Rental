package id.co.nexsoft.bookrentalapi.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
public class Books {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@NotBlank
	private String title;
	@NotBlank
	private String author;
	@ManyToOne
	@JoinColumn(name = "type_id")
	private BookTypes type;
	@NotNull
	@Min(value = 0)
	private int stock;
	@NotNull
	@Min(value = 0)
	private long price;
	@Lob
	private String description;
	@Column(nullable = true)
	private Date deleteDate;

	public Books() {
	}

	public Books(@NotBlank String title, @NotBlank String author, BookTypes type, @NotNull @Min(0) int stock,
			@NotNull @Min(0) long price, String description, Date deleteDate) {
		this.title = title;
		this.author = author;
		this.type = type;
		this.stock = stock;
		this.price = price;
		this.description = description;
		this.deleteDate = deleteDate;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public BookTypes getType() {
		return type;
	}

	public void setType(BookTypes type) {
		this.type = type;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDeleteDate() {
		return deleteDate;
	}

	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}
}
