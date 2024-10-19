package com.project.maltbackend.config;

public class JwtConstant {

    // Secret key used to sign and verify JWTs to ensure their authenticity and integrity
    public static final String SECRET_KEY="asbgufgihfiidfihoiwerfjdivbfhgivuhaidshcijfdsijjhdsisjhvihadkjfnvkjnfdjm"; //Randomly typed words

    // Specifies that the JWT will be sent in the Authorization header when making API requests.
    public static final String JWT_HEADER="Authorization";     // JWT Format: Bearer <token>

}
