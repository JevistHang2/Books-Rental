package id.co.nexsoft.bookrentalapi.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import id.co.nexsoft.bookrentalapi.model.Users;
import id.co.nexsoft.bookrentalapi.repository.UsersRepository;

@Service
public class CustomUsersDetailsService implements UserDetailsService {
	
	@Autowired
	private UsersRepository usersRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		List<SimpleGrantedAuthority> roles = null;
		
		Users user =  usersRepo.findByuserName(username);
		if (user != null) {
			roles = Arrays.asList(new SimpleGrantedAuthority(user.getRole()));
			return new User(user.getUserName(), user.getPassword(), roles);
		}

		throw new UsernameNotFoundException("User not found with the name " + username);
	}
}
