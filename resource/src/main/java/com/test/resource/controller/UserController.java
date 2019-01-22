package com.test.resource.controller;

import com.test.mysql.entity.User;
import com.test.mysql.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping("/user")
    public List<Map<String, Object>> user(Principal puser) {
        User user = userService.findByName(puser.getName());

        Map<String, Object> userinfo = new HashMap<>();

        userinfo.put("id", user.getId());
        userinfo.put("name",user.getName());
        userinfo.put("email", user.getEmail());
        userinfo.put("department",user.getDepartment().getName());
        userinfo.put("createdate", user.getCreatedate());

        List<Map<String, Object>> users = new ArrayList<>();
        users.add(userinfo);

        return users;
    }
}
