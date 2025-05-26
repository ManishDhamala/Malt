package com.project.maltbackend.exception;

public class ResourceNotFoundException extends RuntimeException{

    public ResourceNotFoundException(String message){
        super(message);  // Sends the error message to the parent class
    }
}
