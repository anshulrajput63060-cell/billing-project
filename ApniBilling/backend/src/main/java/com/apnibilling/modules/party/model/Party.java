package com.apnibilling.modules.party.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "parties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Party {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID tenantId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 15)
    private String gstin;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String partyType = "B2C";

    @Column(length = 2)
    private String stateCode;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
