package id.co.nexsoft.bookrentalapi.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import id.co.nexsoft.bookrentalapi.authentication.AuthenticationRequest;
import id.co.nexsoft.bookrentalapi.authentication.AuthenticationResponse;
import id.co.nexsoft.bookrentalapi.config.CustomUsersDetailsService;
import id.co.nexsoft.bookrentalapi.dto.UsersLoginResponseDTO;
import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.repository.UsersRepository;
import id.co.nexsoft.bookrentalapi.util.JwtUtil;

@Service
public class AuthenticationService {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private CustomUsersDetailsService usersDetailsService;

	@Autowired
	private JwtUtil jwtUtils;

	@Autowired
	private UsersRepository usersRepo;

	@Autowired
	private UsersService usersService;

	private ModelMapper modelMapper = new ModelMapper();

	public ResponseEntity<?> createAuthenticateToken(AuthenticationRequest authenticationRequest) throws Exception {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
					authenticationRequest.getUsername(), authenticationRequest.getPassword()));

			UserDetails userDetails = usersDetailsService.loadUserByUsername(authenticationRequest.getUsername());
			String token = jwtUtils.generateToken(userDetails);

			Users user = usersRepo.findByuserName(authenticationRequest.getUsername());
			UsersLoginResponseDTO usersLoginResponseDTO = modelMapper.map(user, UsersLoginResponseDTO.class);
			AuthenticationResponse authenticationResponse = new AuthenticationResponse(usersLoginResponseDTO, token);
			return ResponseEntity.ok().body(authenticationResponse);
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect password!");
		}
	}

	public ResponseEntity<?> loginUser(AuthenticationRequest authenticationRequest) throws Exception {
		Users user = usersService.getUserByUserName(authenticationRequest.getUsername());
		if (user == null || user.getDeleteDate() != null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username not found!");
		}
			return createAuthenticateToken(authenticationRequest);
	}

}
