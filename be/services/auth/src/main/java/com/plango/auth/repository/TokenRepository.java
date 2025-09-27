package com.plango.auth.repository;

import java.util.List;
import java.util.Optional;

import com.plango.auth.model.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface TokenRepository extends JpaRepository<Token, Integer> {

    @Query("SELECT t FROM Token t INNER JOIN User u ON t.user.id = u.id WHERE u.id = ?1 AND (t.expired = false OR t.revoked = false OR t.deleteFlag = false)")
    List<Token> findAllValidTokenByUser(Long userId);

    @Query("SELECT t FROM Token t WHERE t.token = ?1 AND (t.expired = false OR t.revoked = false OR t.deleteFlag = false)")
    Optional<Token> findByToken(String token);
}
