package com.test.web2.controller;

import com.test.web2.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@Controller
public class TestController {

    @RequestMapping("/")
    public String getUser(ModelMap model, Principal user){
        model.addAttribute("user",user);
        return "user/index";
    }

    @RequestMapping("/show")
    public String show(ModelMap model,User user) throws Exception{
        model.addAttribute("user",user);
        return "user/show";
    }

}
