package com.plango.auth.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class BaseEntity implements Serializable {

    @CreatedBy
    @Column(length = 255)
    private String createId;

    @LastModifiedBy
    @Column(length = 255)
    private String updateId;

    @CreationTimestamp
    @Column(name = "createAt", nullable = false)
    private LocalDateTime createAt;

    @UpdateTimestamp
    @Column(name = "updateAt", nullable = false)
    private LocalDateTime updateAt;

    @Column(name = "deleteFlag")
    private boolean deleteFlag;
}
