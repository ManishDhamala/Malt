package com.project.maltbackend.exception;

public class BadRequestException extends  RuntimeException{

    public BadRequestException(String message){
        super(message); // Sends the error message to the parent class
    }

}
