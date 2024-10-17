package com.project.maltbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MaltBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(MaltBackendApplication.class, args);

        System.out.println("Hello World");
        System.out.println("The program has started");
    }

}
