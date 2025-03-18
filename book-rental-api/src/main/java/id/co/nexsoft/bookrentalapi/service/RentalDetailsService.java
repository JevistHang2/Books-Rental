package id.co.nexsoft.bookrentalapi.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.nexsoft.bookrentalapi.dto.DashboardResponse;
import id.co.nexsoft.bookrentalapi.dto.RentalDetailsDTO;
import id.co.nexsoft.bookrentalapi.dto.RentalRequestDTO;
import id.co.nexsoft.bookrentalapi.model.Books;
import id.co.nexsoft.bookrentalapi.model.Rentals;
import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.repository.BooksRepository;
import id.co.nexsoft.bookrentalapi.repository.RentalDetailsRepository;
import id.co.nexsoft.bookrentalapi.repository.RentalsRepository;
import id.co.nexsoft.bookrentalapi.repository.UsersRepository;

import id.co.nexsoft.bookrentalapi.util.CurrencyToRupiahUtil;

@Service
public class RentalDetailsService {
	@Autowired
	private RentalDetailsRepository rentalDetailsRepo;

	@Autowired
	private BooksRepository booksRepo;

	@Autowired
	private UsersRepository usersRepo;

	@Autowired
	private RentalsRepository rentalsRepo;

	@Autowired
	private RentalsService rentalsService;

	@Autowired
	private EmailService emailService;

	public ResponseEntity<?> getUserRental() {
		return ResponseEntity.ok().body(rentalDetailsRepo.getUserRental());
	}

	public ResponseEntity<?> getRentalDetailsByRentalId(int rentalId) {
		return ResponseEntity.ok().body(rentalDetailsRepo.getUserRentalDetailsByRentalId(rentalId));
	}

	public ResponseEntity<?> getRentalDetailsByUserId(int userId) {
		return ResponseEntity.ok().body(rentalDetailsRepo.getUserRentalDetailsByUserId(userId));
	}

	public ResponseEntity<?> getRentalHistory() {
		return ResponseEntity.ok().body(rentalDetailsRepo.getRentalHistory());
	}

	public ResponseEntity<?> getRentalDetailsHistory(int rentalId) {
		return ResponseEntity.ok().body(rentalDetailsRepo.getRentalDetailsHistory(rentalId));
	}

	public ResponseEntity<?> getRentalDetailsHistoryByUserId(int userId) {
		return ResponseEntity.ok().body(rentalDetailsRepo.getRentalDetailsHistoryByUserId(userId));
	}

	public ResponseEntity<?> searchUserRentalByName(String key) {
		return ResponseEntity.ok().body(rentalDetailsRepo.searchUserRentalByName(key));
	}

	public ResponseEntity<?> searchRentalHistoryByNameOrBookOrDate(String key) {
		return ResponseEntity.ok().body(rentalDetailsRepo.searchRentalHistoryByNameOrBookOrDate(key));
	}

	public ResponseEntity<?> searchRentalDetailsHistoryByUserIdWithNameOrBookOrDate(int userId, String key) {
		return ResponseEntity.ok()
				.body(rentalDetailsRepo.searchRentalDetailsHistoryByUserIdWithNameOrBookOrDate(userId, key));
	}

	public ResponseEntity<?> searchAllDetailRentalHistoryByNameOrBookOrDateForPDF(String key) {
		return ResponseEntity.ok().body(rentalDetailsRepo.searchAllDetailRentalHistoryByNameOrBookOrDateForPDF(key));
	}

	// Pagination
	public ResponseEntity<?> searchUserRentalByNamePagination(String key, int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok().body(rentalDetailsRepo.searchUserRentalByNamePagination(key, pageable));
	}

	public ResponseEntity<?> searchRentalHistoryByNameOrBookOrDatePagination(String key, int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok()
				.body(rentalDetailsRepo.searchRentalHistoryByNameOrBookOrDatePagination(key, pageable));
	}

	public ResponseEntity<?> searchRentalDetailsHistoryByUserIdWithNameOrBookOrDatePagination(int userId, String key,
			int pageNo, int pageSize) {
		Pageable pageable = PageRequest.of(pageNo, pageSize);
		return ResponseEntity.ok().body(rentalDetailsRepo
				.searchRentalDetailsHistoryByUserIdWithNameOrBookOrDatePagination(userId, key, pageable));
	}

	public ResponseEntity<?> getDashboardDataAdmin() {
		DashboardResponse dataDashboard = new DashboardResponse();
		dataDashboard.setCountRentalBookThisMonth(rentalDetailsRepo.countRentaledBookThisMonthAdmin());
		dataDashboard.setCountReturnBookThisMonth(rentalDetailsRepo.countReturnBookThisMonthAdmin());
		dataDashboard.setSumIncomeThisMonth(rentalDetailsRepo.sumIncomeThisMonthAdmin());
		return ResponseEntity.ok().body(dataDashboard);
	}

	public ResponseEntity<?> getDashboardDataUser(int userId) {
		DashboardResponse dataDashboard = new DashboardResponse();
		dataDashboard.setCountRentalBookThisMonth(rentalDetailsRepo.countRentaledBookThisMonthUser(userId));
		dataDashboard.setCountBookOnRentalThisMonth(rentalDetailsRepo.countBookOnRentalThisMonthUser(userId));
		dataDashboard.setSumIncomeThisMonth(rentalDetailsRepo.sumIncomeThisMonthUser(userId));
		return ResponseEntity.ok().body(dataDashboard);
	}

	@Transactional
	public ResponseEntity<?> updateRentalDetailsById(List<RentalDetailsDTO> rentalDetailsDTO) {
		Date endRentalDate = new Date();
		String changeStatusRental = "RETURN";
		int maxRentalDays = 5;
		long finePrice = 0;
		long overdueFinePrice = 1000;
		long totalPrice = 0;
		long allBookFinePrice = 0;
		long allBookTotalPrice = 0;
		long sumAllFineAndRentalPrice = 0;
		String message = "\n";
		int indexBooks = 0;

		for (RentalDetailsDTO items : rentalDetailsDTO) {
			indexBooks += 1;
			long countRentalDays = ((endRentalDate.getTime() - items.getStartRentalDate().getTime()) / 86400000) + 1;

			if (countRentalDays > maxRentalDays) {
				finePrice = 0;
				long overDay = countRentalDays - maxRentalDays;
				finePrice = overDay * overdueFinePrice;
				allBookFinePrice = allBookFinePrice + finePrice;
			}
			totalPrice = countRentalDays * items.getRentalPrice();
			allBookTotalPrice = allBookTotalPrice + totalPrice;

			// Update Rental Details
			rentalDetailsRepo.updateRentalDetailsById(items.getRentalDetailsId(), endRentalDate, finePrice,
					totalPrice + finePrice, changeStatusRental);

			message += "================== " + indexBooks + " ================== \n" + "Book Title : "
					+ items.getBookTitles() + "\n" + "Price/Day : "
					+ CurrencyToRupiahUtil.currencyID(items.getRentalPrice()) + "\n" + "Rental Time (Day) : "
					+ countRentalDays + "\n" + "Fine Price : " + CurrencyToRupiahUtil.currencyID(finePrice) + "\n"
					+ "Total Price/Book :" + CurrencyToRupiahUtil.currencyID((totalPrice + finePrice)) + "\n";

			// Update add 1 Book Stock when return Book
			int bookStock = booksRepo.getStockByBookId(items.getBooksId());
			booksRepo.updateStock(items.getBooksId(), bookStock + 1);
		}

		sumAllFineAndRentalPrice = allBookFinePrice + allBookTotalPrice;

		message += "\n>>>>>>>>>>>>>> All Total Price <<<<<<<<<<<<<\n" + "Total Price : "
				+ CurrencyToRupiahUtil.currencyID((sumAllFineAndRentalPrice));

		// Email Service Send Information
		Users user = usersRepo.getUserById(rentalDetailsDTO.get(0).getUsersId());
		String emailTo = user.getEmail();
		String subject = "BOOK RETURNED WITH RENTAL ID #" + rentalDetailsDTO.get(0).getRentalsId();
		String textBody = "You're Return the Book With Details Below: " + message + "\n\n"
				+ "Thank You For Rentaled Book at NexBook, \n" + "Please Rent Books Again and Enjoy Reading These Book";

		emailService.sendEmail(emailTo, subject, textBody);
		// End Email Service

		return ResponseEntity.ok().body("Success Return Book \n" + message);
	}

	public ResponseEntity<?> validationBookBeforeCheckout(RentalRequestDTO rentalRequest) {
		ResponseEntity<?> response = null;
		String message = null;
		Users user = rentalRequest.getUser();
		List<Books> books = rentalRequest.getBooks();

		// Preparing data book category/types from rental request(Bag/Cart)
		List<String> bookTypes = new ArrayList<>();
		for (Books items : books) {
			bookTypes.add(items.getType().getName());
		}

		// Preparing data book category/types in List From Database
		List<RentalDetailsDTO> rentalDetailsDTO = rentalDetailsRepo
				.getUserRentalDetailsByUserId(rentalRequest.getUser().getId());

		// Get Count book category/types From Database with user id
		int countNovelInDatabase = (int) rentalDetailsRepo
				.countBookTypeOnRentalByUserAndType(rentalRequest.getUser().getId(), "NOVEL");
		int countComicInDatabase = (int) rentalDetailsRepo
				.countBookTypeOnRentalByUserAndType(rentalRequest.getUser().getId(), "COMIC");
		int countEnsiklopediaInDatabase = (int) rentalDetailsRepo
				.countBookTypeOnRentalByUserAndType(rentalRequest.getUser().getId(), "Ensiklopedia");
		int totalBooksInDatabase = countNovelInDatabase + countComicInDatabase + countEnsiklopediaInDatabase;

		// Check Books are Rentaled or not
		for (Books items : books) {
			// Check Book Stock
			if (items.getStock() == 0) {
				message = "Book Title: " + items.getTitle() + " are out of Stock Now";
				response = ResponseEntity.badRequest().body(message);
				break;
			}

			for (RentalDetailsDTO itemCheck : rentalDetailsDTO) {
				if (items.getId() == itemCheck.getBooksId()) {
					message = "You are Already Rental This Book !! \n" + "- Book Title = " + itemCheck.getBookTitles();
					response = ResponseEntity.badRequest().body(message);
				}
			}
		}

		if (response == null) {
			// Check Limit Book For Role Member & User
			if (user.getRole().equals("ROLE_USER") && (bookTypes.size() + totalBooksInDatabase) > 3) {
				message = "Your Role Status is USER, Limit rental is 3 books!! \n" + "- Your Bag now have: "
						+ bookTypes.size() + " book. \n" + "- Your Rentaled books has: " + totalBooksInDatabase
						+ " book. \n"
						+ "Please Return Rentaled Books or Remove Books from Bag to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if (user.getRole().equals("ROLE_MEMBER") && (bookTypes.size() + totalBooksInDatabase) > 5) {
				message = "Your Role Status is MEMBER, Limit rental is 5 books!! \n" + "- Your Bag now have: "
						+ bookTypes.size() + " book. \n" + "- Your Rentaled books has: " + totalBooksInDatabase
						+ " book. \n"
						+ "Please Return Rentaled Books or Remove Books from Bag to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			}
		}

		// Validation For Books
		if (user.getRole().equals("ROLE_USER")) {
			response = validationBookRoleUser(bookTypes, countNovelInDatabase, countComicInDatabase,
					countEnsiklopediaInDatabase, response);
		} else if (user.getRole().equals("ROLE_MEMBER")) {
			response = validationBookRoleMember(bookTypes, countNovelInDatabase, countComicInDatabase,
					countEnsiklopediaInDatabase, response);
		}

		return checkout(rentalRequest, response);
	}

	public ResponseEntity<?> validationBookRoleUser(List<String> bookTypes, int countNovelInDatabase,
			int countComicInDatabase, int countEnsiklopediaInDatabase, ResponseEntity<?> response) {
		String message = null;
		if (response == null) {
			int countNovel = 0;
			int countComic = 0;
			int countEnsiklopedia = 0;

			for (String type : bookTypes) {
				if (type.equalsIgnoreCase("NOVEL")) {
					countNovel++;
				} else if (type.equalsIgnoreCase("COMIC")) {
					countComic++;
				} else if (type.equalsIgnoreCase("Ensiklopedia")) {
					countEnsiklopedia++;
				}
			}

			int totalBookCount = countNovel + countComic + countEnsiklopedia + countNovelInDatabase
					+ countComicInDatabase + countEnsiklopediaInDatabase;
			if ((countNovel + countNovelInDatabase) >= 2 && totalBookCount >= 3) {
				message = "Maximum limit exceded, limit for Novel is 2 book. \n" + "- Your Bag have: " + countNovel
						+ " Novel Book. \n" + "- Your Rentaled Book have: " + countNovelInDatabase + " Novel, "
						+ countComicInDatabase + " Comic, " + countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countComic + countComicInDatabase) >= 1 && (countNovel + countNovelInDatabase) >= 1
					&& totalBookCount >= 3) {
				message = "Maximum limit exceded, limit for Comic is 1 book & Novel is 1 book. \n" + "- Your Bag have: "
						+ countComic + " Comic & " + countNovel + " Novel Books. \n" + "- Your Rentaled Book have: "
						+ countComicInDatabase + " Comic, " + countNovelInDatabase + " Novel, "
						+ countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countComic + countComicInDatabase) >= 1
					&& (countEnsiklopedia + countEnsiklopediaInDatabase) >= 1 && totalBookCount >= 2) {
				message = "Maximum limit exceded, limit for Comic is 1 book & Novel is 1 book. \n" + "- Your Bag have: "
						+ countComic + " Comic & " + countNovel + " Novel Books. \n" + "- Your Rentaled Book have: "
						+ countComicInDatabase + " Comic, " + countNovelInDatabase + " Novel, "
						+ countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countComic + countComicInDatabase) >= 2 && totalBookCount >= 2) {
				message = "Maximum limit exceded, limit for Comic is 1 book & Novel is 1 book. \n" + "- Your Bag have: "
						+ countComic + " Comic & " + countNovel + " Novel Books. \n" + "- Your Rentaled Book have: "
						+ countComicInDatabase + " Comic, " + countNovelInDatabase + " Novel, "
						+ countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countEnsiklopedia + countEnsiklopediaInDatabase) >= 1 && totalBookCount >= 2) {
				message = "Maximum limit exceded, limit for Book Ensiklopedia is 1 book. \n" + "- Your Bag have: "
						+ countEnsiklopedia + " Ensiklopedia Book. \n" + "- Your Rentaled Book have: "
						+ countNovelInDatabase + " Novel, " + countComicInDatabase + " Comic, "
						+ countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			}
		}
		return response;
	}

	public ResponseEntity<?> validationBookRoleMember(List<String> bookTypes, int countNovelInDatabase,
			int countComicInDatabase, int countEnsiklopediaInDatabase, ResponseEntity<?> response) {
		String message = null;
		if (response == null) {
			int countNovel = 0;
			int countComic = 0;
			int countEnsiklopedia = 0;

			for (String type : bookTypes) {
				if (type.equalsIgnoreCase("NOVEL")) {
					countNovel++;
				} else if (type.equalsIgnoreCase("COMIC")) {
					countComic++;
				} else if (type.equalsIgnoreCase("Ensiklopedia")) {
					countEnsiklopedia++;
				}
			}

			int totalBookCount = countNovel + countComic + countEnsiklopedia + countNovelInDatabase
					+ countComicInDatabase + countEnsiklopediaInDatabase;
			if ((countNovel + countNovelInDatabase) >= 4 && totalBookCount >= 5) {
				message = "Maximum limit exceded, limit for Novel is 4 book. \n" + "- Your Bag have: " + countNovel
						+ " Novel Book. \n" + "- Your Rentaled Book have: " + countNovelInDatabase + " Novel, "
						+ countComicInDatabase + " Comic, " + countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countComic + countComicInDatabase) >= 3 && totalBookCount >= 4) {
				message = "Maximum limit exceded, limit for Comic is 3 book. \n" + "- Your Bag have: " + countComic
						+ " Comic Book. \n" + "- Your Rentaled Book have: " + countComicInDatabase + " Comic, "
						+ countNovelInDatabase + " Novel, " + countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countComic + countComicInDatabase) >= 2 && (countNovel + countNovelInDatabase) >= 3
					&& totalBookCount >= 6) {
				message = "Maximum limit exceded, limit for Comic is 2 book & Novel is 3 book. \n" + "- Your Bag have: "
						+ countComic + " Comic & " + countNovel + " Novel Books. \n" + "- Your Rentaled Book have: "
						+ countComicInDatabase + " Comic, " + countNovelInDatabase + " Novel, "
						+ countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);

				// Check for each type of books
			} else if ((countComic + countComicInDatabase) >= 1 && (countNovel + countNovelInDatabase) >= 1
					&& (countEnsiklopedia + countEnsiklopediaInDatabase) >= 1 && totalBookCount >= 4) {
				message = "Maximum limit exceded, limit for Each type book is 1 book. \n" + "- Your Bag have: "
						+ countComic + " Comic, " + countNovel + " Novel, " + countEnsiklopedia
						+ " Ensiklopedia Books. \n" + "- Your Rentaled Book have: " + countComicInDatabase + " Comic, "
						+ countNovelInDatabase + " Novel, " + countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countNovel + countNovelInDatabase) >= 2
					&& (countEnsiklopedia + countEnsiklopediaInDatabase) >= 1 && totalBookCount >= 3) {
				message = "Maximum limit exceded, limit for Each type book is 1 book. \n" + "- Your Bag have: "
						+ countComic + " Comic, " + countNovel + " Novel, " + countEnsiklopedia
						+ " Ensiklopedia Books. \n" + "- Your Rentaled Book have: " + countComicInDatabase + " Comic, "
						+ countNovelInDatabase + " Novel, " + countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			} else if ((countComic + countComicInDatabase) >= 2
					&& (countEnsiklopedia + countEnsiklopediaInDatabase) >= 1 && totalBookCount >= 3) {
				message = "Maximum limit exceded, limit for Each type book is 1 book. \n" + "- Your Bag have: "
						+ countComic + " Comic, " + countNovel + " Novel, " + countEnsiklopedia
						+ " Ensiklopedia Books. \n" + "- Your Rentaled Book have: " + countComicInDatabase + " Comic, "
						+ countNovelInDatabase + " Novel, " + countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			}
			// End Check for each type of books

			else if ((countEnsiklopedia + countEnsiklopediaInDatabase) >= 2 && totalBookCount >= 3) {
				message = "Maximum limit exceded, limit for Ensiklopedia is 2 book. \n" + "- Your Bag have: "
						+ countEnsiklopedia + " Ensiklopedia Book. \n" + "- Your Rentaled Book have: "
						+ countNovelInDatabase + " Novel, " + countComicInDatabase + " Comic, "
						+ countEnsiklopediaInDatabase + " Ensiklopedia Books. \n"
						+ "\nPlease Remove Other type books in bag or Return Rentaled Books to Continue Rent New Books";
				response = ResponseEntity.badRequest().body(message);
			}
		}
		return response;
	}

	@Transactional
	public ResponseEntity<?> checkout(RentalRequestDTO rentalRequest, ResponseEntity<?> response) {
		if (response == null) {
			Users user = usersRepo.getUserById(rentalRequest.getUser().getId());
			List<Books> books = rentalRequest.getBooks();

			String statusRental = "RENTAL";
			Date dateNow = new Date();

			// Insert to database rental
			rentalsRepo.addRental(dateNow, user.getId());

			// Insert to database rental details with looping
			Rentals rental = rentalsService.getRentalById(dateNow, user.getId());
			int rentalId = rental.getId();
			for (Books items : books) {
				rentalDetailsRepo.addRental(rentalId, items.getId(), items.getPrice(), statusRental);
				int bookStock = booksRepo.getStockByBookId(items.getId());
				booksRepo.updateStock(items.getId(), bookStock - 1);
			}
			response = ResponseEntity.ok().body("Success Checkout");
		}
		return response;
	}
}
