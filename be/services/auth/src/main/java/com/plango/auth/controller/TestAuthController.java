package com.plango.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAuthController {
    @GetMapping("/auth-required")
    public String TestAuthController() {
        return "Login required!";
    }
}
