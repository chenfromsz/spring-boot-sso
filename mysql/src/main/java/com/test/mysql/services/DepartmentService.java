package com.test.mysql.services;

import com.test.mysql.entity.Department;
import com.test.mysql.model.DepartmentQo;
import com.test.mysql.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;

    public void save(Department department){
        departmentRepository.save(department);
    }

    public Department findOne(Long id){
        return  departmentRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        departmentRepository.deleteById(id);
    }

    public void deleteAll(){
        departmentRepository.deleteAll();
    }

    public List<Department> findAll(){
        return departmentRepository.findAll();
    }


    public Page<Department> findAll(DepartmentQo departmentQo, Pageable pageable){
        return departmentRepository.findAll(new Specification<Department>(){
            @Override
            public Predicate toPredicate(Root<Department> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicatesList = new ArrayList<Predicate>();

                if(!StringUtils.isEmpty(departmentQo.getName())){
                    predicatesList.add(criteriaBuilder.like(root.get("name"), "%" + departmentQo.getName() + "%"));
                }
                query.where(predicatesList.toArray(new Predicate[predicatesList.size()]));

                return query.getRestriction();
            }
        }, pageable);
    }

}
