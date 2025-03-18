package id.co.nexsoft.bookrentalapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO;
import id.co.nexsoft.bookrentalapi.dto.RentalRequestDTO;
import id.co.nexsoft.bookrentalapi.service.RentalDetailsService;

@RestController
@RequestMapping("api/")
public class RentalDetailsController {
	@Autowired
	private RentalDetailsService rentalDetailsService;

	@PostMapping("/user/checkout")
	public ResponseEntity<?> checkout(@RequestBody RentalRequestDTO rentalRequest) {
		return rentalDetailsService.validationBookBeforeCheckout(rentalRequest);
	}

	@PostMapping("/admin/returnbook")
	public ResponseEntity<?> returnBooks(@RequestBody List<RentalDetailsDTO> rentalDetails) {
		return rentalDetailsService.updateRentalDetailsById(rentalDetails);
	}

	@GetMapping("/admin/getuserrental")
	public ResponseEntity<?> getUserRental() {
		return rentalDetailsService.getUserRental();
	}

	@GetMapping("/admin/getuserrentaldetails/id={rentalId}")
	public ResponseEntity<?> getRentailDetailsByRentalId(@PathVariable("rentalId") int rentalId) {
		return rentalDetailsService.getRentalDetailsByRentalId(rentalId);
	}

	@GetMapping("/user/getuserrentaldetails/userid={userId}")
	public ResponseEntity<?> getRentailDetailsByUserId(@PathVariable("userId") int userId) {
		return rentalDetailsService.getRentalDetailsByUserId(userId);
	}

	@GetMapping("/admin/getrentalhistory")
	public ResponseEntity<?> getRentalHistory() {
		return rentalDetailsService.getRentalHistory();
	}

	@GetMapping("/admin/getrentalhistory/rentalid={rentalId}")
	public ResponseEntity<?> getRentalDetailsHistory(@PathVariable("rentalId") int rentalId) {
		return rentalDetailsService.getRentalDetailsHistory(rentalId);
	}

	@GetMapping("/admin/getuserrental/key={key}")
	public ResponseEntity<?> searchUserRentalByName(@PathVariable("key") String key) {
		return rentalDetailsService.searchUserRentalByName(key);
	}

	@GetMapping("/admin/getrentalhistory/key={key}")
	public ResponseEntity<?> searchRentalHistoryByNameOrBookOrDate(@PathVariable("key") String key) {
		return rentalDetailsService.searchRentalHistoryByNameOrBookOrDate(key);
	}

	@GetMapping("/admin/getdatadashboard")
	public ResponseEntity<?> getDashboardDataAdmin() {
		return rentalDetailsService.getDashboardDataAdmin();
	}

	@GetMapping("/user/getdatadashboard/userid={userId}")
	public ResponseEntity<?> getDashboardDataUser(@PathVariable("userId") int userId) {
		return rentalDetailsService.getDashboardDataUser(userId);
	}

	@GetMapping("/user/getrentalhistory/userid={userId}")
	public ResponseEntity<?> getRentalDetailsHistoryByUserId(@PathVariable("userId") int userId) {
		return rentalDetailsService.getRentalDetailsHistoryByUserId(userId);
	}

	@GetMapping("/user/getrentalhistories/userid={userId}&key={key}")
	public ResponseEntity<?> searchRentalDetailsHistoryByUserIdWithNameOrBookOrDate(@PathVariable("userId") int userId,
			@PathVariable("key") String key) {
		return rentalDetailsService.searchRentalDetailsHistoryByUserIdWithNameOrBookOrDate(userId, key);
	}

	@GetMapping("/admin/getuserrentalpagination/key={key}")
	public ResponseEntity<?> searchUserRentalByNamePagination(@PathVariable("key") String key,
			@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "5") Integer pageSize) {
		return rentalDetailsService.searchUserRentalByNamePagination(key, pageNo, pageSize);
	}

	@GetMapping("/admin/getrentalhistorypagination/key={key}")
	public ResponseEntity<?> searchRentalHistoryByNameOrBookOrDatePagination(@PathVariable("key") String key,
			@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "5") Integer pageSize) {
		return rentalDetailsService.searchRentalHistoryByNameOrBookOrDatePagination(key, pageNo, pageSize);
	}

	@GetMapping("/user/getrentalhistoriespagination/userid={userId}&key={key}")
	public ResponseEntity<?> searchRentalDetailsHistoryByUserIdWithNameOrBookOrDatePagination(
			@PathVariable("userId") int userId, @PathVariable("key") String key,
			@RequestParam(defaultValue = "0") Integer pageNo, @RequestParam(defaultValue = "5") Integer pageSize) {
		return rentalDetailsService.searchRentalDetailsHistoryByUserIdWithNameOrBookOrDatePagination(userId, key, pageNo, pageSize);
	}
	
	@GetMapping("/admin/getalldetailsrentalhistoryforpdf/key={key}")
	public ResponseEntity<?> searchAllDetailRentalHistoryByNameOrBookOrDateForPDF(@PathVariable("key") String key) {
		return rentalDetailsService.searchAllDetailRentalHistoryByNameOrBookOrDateForPDF(key);
	}
}
