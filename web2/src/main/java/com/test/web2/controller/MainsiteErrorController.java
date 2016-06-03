package com.test.web2.controller;

import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainsiteErrorController implements ErrorController {

    private static final String ERROR_PATH = "/error";

    @RequestMapping(value=ERROR_PATH)
    public String handleError(){
        return "403";
    }

    @Override
    public String getErrorPath() {
        // TODO Auto-generated method stub
        return ERROR_PATH;
    }

    @RequestMapping(value="/deny")
    public String handleDeny(){
        return "deny";
    }

    @RequestMapping("/tosignout")
    public String tosso() {
        return "tosignout";
    }

    @RequestMapping("/login")
    public String dashboard() {
        return "redirect:/#/";
    }

}
