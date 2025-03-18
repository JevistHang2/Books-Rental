package id.co.nexsoft.bookrentalapi.service;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService extends Thread {
	@Autowired
	private JavaMailSender javaMailSender;

	public static int noOfQuickServiceThreads = 2;

	private ScheduledExecutorService quickService = Executors.newScheduledThreadPool(noOfQuickServiceThreads);

	public void sendEmail(String toEmail, String subject, String body) {
		SimpleMailMessage message = new SimpleMailMessage();

		message.setFrom("nexbook.project.batch6@gmail.com");
		message.setTo(toEmail);
		message.setSubject(subject);
		message.setText(body);
		quickService.submit(new Runnable() {
			@Override
			public void run() {
				try{
					javaMailSender.send(message);
				}catch(Exception e){
					e.printStackTrace();
				}
			}
		});
	}
}
