package com.plango.auth.repository;

import java.util.Optional;

import com.plango.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.id = ?1 AND u.deleteFlag = false ")
    Optional<User> findById(Long id);

    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.deleteFlag = false ")
    Optional<User> findActiveUserByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = ?1 AND u.deleteFlag = false ")
    Optional<User> findByActiveAndInactiveEmail(String email);

    boolean existsByEmail(String email);
}
