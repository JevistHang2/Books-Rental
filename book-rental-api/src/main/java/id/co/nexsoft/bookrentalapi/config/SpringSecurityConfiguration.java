package id.co.nexsoft.bookrentalapi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfiguration extends WebSecurityConfigurerAdapter {
	@Autowired
	private CustomUsersDetailsService usersDetailsService;

	@Autowired
	private CustomJwtAuthenticationFilter customJwtAuthenticationFilter;

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(usersDetailsService).passwordEncoder(passwordEncoder());
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	public void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().authorizeRequests()
				.antMatchers(
						"/api/admin/booktypes",
						"/api/admin/books",
						"/api/admin/getadminandstaff",
						"/api/admin/getmemberanduser",
						"/api/admin/getmemberanduser/id={id}",
						"/api/admin/updatebook",
						"/api/admin/deletebook",
						"/api/admin/updatebooktypes",
						"/api/admin/deletebooktypes",
						"/api/admin/registerstaff",
						"/api/admin/deletestaff",
						"/api/admin/editcustomerrole",
						"/api/admin/getuserrental",
						"/api/admin/getuserrentaldetails/id={rentalId}",
						"/api/admin/returnbook",
						"/api/admin/getrentalhistory",
						"/api/admin/getrentalhistory/rentalid={rentalId}",
						"/api/admin/getbooktypes/key={key}",
						"/api/admin/getadminandstaff/key={key}",
						"/api/admin/getmemberanduser/key={key}",
						"/api/admin/getuserrental/key={key}",
						"/api/admin/getrentalhistory/key={key}",
						"/api/admin/getdatadashboard",
						"/api/admin/addbookimages",
						"/api/admin/editbookimages",
						"/api/admin/getbooktypespagination/key={key}",
						"/api/admin/getadminandstaffpagination/key={key}",
						"/api/admin/getmemberanduserpagination/key={key}",
						"/api/admin/getuserrentalpagination/key={key}",
						"/api/admin/getrentalhistorypagination/key={key}",
						"/api/admin/getalldetailsrentalhistoryforpdf/key={key}",
						"/api/admin/edituser"
				).hasAnyRole("STAFF", "ADMIN")
				.antMatchers(
						"/api/user/edituser",
						"/api/user/rental",
						"/api/user/checkout",
						"/api/user/rentalsid={id}",
						"/api/user/getuserrentaldetails/userid={userId}",
						"/api/user/getdatadashboard/userid={userId}",
						"/api/user/getbooks/bookid={bookId}",
						"/api/user/getrentalhistory/userid={userId}",
						"/api/user/getrentalhistories/userid={userId}&key={key}",
						"/api/user/getrentalhistoriespagination/userid={userId}&key={key}"
				).hasAnyRole("USER", "MEMBER")
				.antMatchers(
						"/api/updateprofileimages",
						"/api/deleteprofileimages",
						"/api/getprofileimages/userid={userId}",
						"/api/edituserpassword"
				).hasAnyRole("ADMIN", "STAFF", "MEMBER", "USER")
				.antMatchers(
						"/api/login", 
						"/api/user/register",
						"/api/getbooktypes",
						"/api/getbooks",
						"/api/getbooks/key={key}",
						"/api/getimage/bookid={bookId}",
						"/api/getbookspagination",
						"/api/getbookspagination/key={key}"
				).permitAll()
				.anyRequest().authenticated().and().exceptionHandling()
				.authenticationEntryPoint(jwtAuthenticationEntryPoint).and().sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
				.addFilterBefore(customJwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
	}
}
