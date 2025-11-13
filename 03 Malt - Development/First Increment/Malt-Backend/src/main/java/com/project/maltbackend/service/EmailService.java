package com.project.maltbackend.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

//    //Simple method for sending mail
//    public void sendEmail(String to, String subject, String text) {
//        try{
//            SimpleMailMessage mail = new SimpleMailMessage();
//            mail.setTo(to);
//            mail.setSubject(subject);
//            mail.setText(text);
//            mailSender.send(mail);
//
//        }catch (Exception e) {
//            log.error("Exception while Sending email",e);
//        }
//
//    }


    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true enables HTML


            mailSender.send(message);

            log.info("HTML Email sent to {}", to);
        } catch (Exception e) {
            log.error("Error sending email", e);
        }
    }

    // Method to load HTML templates (For HTML mail)
    public String loadTemplate(String templateName) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + templateName);
            byte[] bytes = Files.readAllBytes(Path.of(resource.getURI()));
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to load email template: {}", templateName, e);
            return "";
        }
    }

}

