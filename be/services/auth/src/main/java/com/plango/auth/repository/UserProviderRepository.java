package com.plango.auth.repository;

import com.plango.auth.model.UserProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProviderRepository extends JpaRepository<UserProvider, Long> {

    @Query("SELECT p from UserProvider p WHERE p.providerId = ?1 and p.deleteFlag = false ")
    Optional<UserProvider> getProviderByProviderId(String providerId);
}
