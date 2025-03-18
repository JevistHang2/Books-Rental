package id.co.nexsoft.bookrentalapi.dto;

import java.util.Date;

import id.co.nexsoft.bookrentalapi.model.BookTypes;

public class BooksDTO {
	private int id;
	private String title;
	private String author;
	private BookTypes type;
	private int stock;
	private long price;
	private String description;
	private Date deleteDate;
	
	public BooksDTO() {
	}

	public BooksDTO(int id, String title, String author, BookTypes type, int stock, long price, String description,
			Date deleteDate) {
		this.id = id;
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
