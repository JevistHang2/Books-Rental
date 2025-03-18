package id.co.nexsoft.bookrentalapi.authentication;

import id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO;

public class AuthenticationResponse {
	private UsersLoginResponseDTO user;
	private String token;

	public AuthenticationResponse() {
	}

	public AuthenticationResponse(UsersLoginResponseDTO user, String token) {
		this.user = user;
		this.token = token;
	}

	public UsersLoginResponseDTO getUser() {
		return user;
	}

	public void setUser(UsersLoginResponseDTO user) {
		this.user = user;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
