package id.co.nexsoft.bookrentalapi.dto;

import java.util.Date;

public class BookTypesDTO {
	private int id;
	private String name;
	private String code;
	private Date deleteDate;
	private long countBooks;
	
	public BookTypesDTO() {
	}

	public BookTypesDTO(int id, String name, String code, Date deleteDate, long countBooks) {
		this.id = id;
		this.name = name;
		this.code = code;
		this.deleteDate = deleteDate;
		this.countBooks = countBooks;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public Date getDeleteDate() {
		return deleteDate;
	}
	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}
	public long getCountBooks() {
		return countBooks;
	}
	public void setCountBooks(long countBooks) {
		this.countBooks = countBooks;
	}
}
