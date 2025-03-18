package id.co.nexsoft.bookrentalapi.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.nexsoft.bookrentalapi.model.Rentals;
import id.co.nexsoft.bookrentalapi.repository.RentalsRepository;

@Service
public class RentalsService {
	@Autowired
	private RentalsRepository rentalRepo;
	
	public Rentals getRentalById(Date dateNow, int userId) {
		return rentalRepo.getRentalById(dateNow, userId);
	}
}
