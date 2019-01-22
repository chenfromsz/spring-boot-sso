package com.test.mysql.services;

import com.test.mysql.entity.Role;
import com.test.mysql.model.RoleQo;
import com.test.mysql.repository.RoleRepository;
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
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public void save(Role role){
        roleRepository.save(role);
    }

    public Role findOne(Long id){
        return  roleRepository.findById(id).orElse(null);
    }

    public void delete(Long id){
        roleRepository.deleteById(id);
    }

    public void deleteAll(){
        roleRepository.deleteAll();
    }

    public List<Role> findAll(){
        return roleRepository.findAll();
    }


    public Page<Role> findAll(RoleQo roleQo, Pageable pageable){
        return roleRepository.findAll(new Specification<Role>(){
            @Override
            public Predicate toPredicate(Root<Role> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicatesList = new ArrayList<Predicate>();

                if(!StringUtils.isEmpty(roleQo.getName())){
                    predicatesList.add(criteriaBuilder.like(root.get("name"), "%" + roleQo.getName() + "%"));
                }
                query.where(predicatesList.toArray(new Predicate[predicatesList.size()]));

                return query.getRestriction();
            }
        }, pageable);
    }

}
