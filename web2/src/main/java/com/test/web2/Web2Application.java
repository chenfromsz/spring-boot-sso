package com.test.web2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableZuulProxy
@ComponentScan(basePackages = "com.test")
public class Web2Application {
    public static void main(String[] args) {
        SpringApplication.run(Web2Application.class, args);
    }
}
