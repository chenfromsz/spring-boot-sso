package com.test.web2.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.test.web2.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestOperations;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.List;

@Controller
public class TestController {

    @Autowired
    private RestOperations restOperations;

    @RequestMapping("/")
    public String getUser(ModelMap model, Principal user, HttpServletRequest request){
        model.addAttribute("user",user);

        String json = restOperations.getForObject("http://localhost:8083/user", String.class);

        List<User> list = new Gson().fromJson(json, new TypeToken<List<User>>() {
        }.getType());

        model.addAttribute("users", list);
        request.getSession().setAttribute("list", list);

        return "user/index";
    }

    @RequestMapping("/show")
    public String show(ModelMap model,Long id, HttpServletRequest request) throws Exception{
        List<User> list = (List<User>)request.getSession().getAttribute("list");

        User user = null;
        for(User user1: list){
           if(user1.getId().compareTo(id) == 0) {
               user = user1;
               break;
           }
        }

        model.addAttribute("user",user);

        return "user/show";
    }

}
