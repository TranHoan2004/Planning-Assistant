package com.plango.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_provider", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "provider", "providerId" })
})
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserProvider extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String provider;

    @Column(nullable = false, length = 100)
    private String providerId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
