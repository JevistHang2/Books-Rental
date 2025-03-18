package id.co.nexsoft.bookrentalapi.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ChangePasswordRequestDTO {
	
	@NotNull
	private int userId;
	@NotBlank
	private String currentPassword;
	@NotBlank
	@Size(min = 6, max = 8, message = "New Password should have min 6 or max 8 of characters")
	private String newPassword;
	@NotBlank
	@Size(min = 6, max = 8, message = "Retype New Password should have min 6 or max 8 of characters")
	private String renewPassword;
	
	public ChangePasswordRequestDTO() {
	}

	public ChangePasswordRequestDTO(int userId, String currentPassword, String newPassword, String renewPassword) {
		this.userId = userId;
		this.currentPassword = currentPassword;
		this.newPassword = newPassword;
		this.renewPassword = renewPassword;
	}
	
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getCurrentPassword() {
		return currentPassword;
	}
	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}
	public String getNewPassword() {
		return newPassword;
	}
	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	public String getRenewPassword() {
		return renewPassword;
	}
	public void setRenewPassword(String renewPassword) {
		this.renewPassword = renewPassword;
	}
}
