package id.co.nexsoft.bookrentalapi.dto;

import java.util.List;

import id.co.nexsoft.bookrentalapi.model.Books;
import id.co.nexsoft.bookrentalapi.model.Users;

public class RentalRequestDTO {
	private Users user;
	private List<Books> books;
	
	public RentalRequestDTO() {
	}
	
	public RentalRequestDTO(Users user, List<Books> books) {
		this.user = user;
		this.books = books;
	}
	
	public Users getUser() {
		return user;
	}
	public void setUser(Users user) {
		this.user = user;
	}
	public List<Books> getBooks() {
		return books;
	}
	public void setBooks(List<Books> books) {
		this.books = books;
	}
}
