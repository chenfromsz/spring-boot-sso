package com.test.mysql.model;

public class DepartmentQo extends PageQo{
    private Long id;
    private String name;

    public DepartmentQo() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
