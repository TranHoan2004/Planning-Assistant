package com.plango.auth.model;

import com.plango.auth.common.code.TokenType;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`token`")
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer id;

    @Column(name = "token", unique = true, nullable = false)
    public String token;

    @Default
    @Enumerated(EnumType.STRING)
    @Column(name = "tokenType")
    public TokenType tokenType = TokenType.BEARER;

    @Default
    @Column(name = "revoked")
    private boolean revoked = false;

    @Default
    @Column(name = "expired")
    private boolean expired = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    public User user;

    @CreationTimestamp
    @Column(name = "createDate", nullable = false)
    private LocalDateTime createDate;

    @UpdateTimestamp
    @Column(name = "updateDate", nullable = false)
    private LocalDateTime updateDate;

    @Column(name = "deleteFlag")
    private boolean deleteFlag;
}
