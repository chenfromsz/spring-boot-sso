package com.test.mysql.test;

import com.test.mysql.TestApplication;
import com.test.mysql.entity.Department;
import com.test.mysql.entity.Role;
import com.test.mysql.entity.User;
import com.test.mysql.services.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.util.Assert;

import java.util.Date;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {JpaConfiguration.class, TestApplication.class})
@SpringBootTest
public class MysqlTest {
    private static Logger logger = LoggerFactory.getLogger(MysqlTest.class);

    @Autowired
    private UserService userService;

    @Before
    public void initData(){
        userService.deleteAll();

        Department department = new Department();
        department.setName("开发部");

        Role role = new Role();
        role.setName("admin");

        User user = new User();
        user.setName("user");
        BCryptPasswordEncoder bpe = new BCryptPasswordEncoder();
        user.setPassword(bpe.encode("user"));
        user.setCreatedate(new Date());

        user.setDepartment(department);

        user.getRoles().add(role);
        user.setRoles(user.getRoles());

        userService.save(user);
        Assert.notNull(user.getId(), "save error");
    }

    @Test
    public void insertUserRoles(){
        User user = userService.findByName("user");
        Assert.notNull(user, "find error");

        logger.info("=======user==== name:{}, department:{}",
                user.getName(), user.getDepartment().getName());
        for(Role role : user.getRoles()){
            logger.info("===========role:{}", role.getName());
        }

    }
}
