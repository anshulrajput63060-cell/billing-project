package com.apnibilling.modules.tenant.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String businessName;

    @Column(length = 150)
    private String tradeName;

    @Column(length = 15)
    private String gstin;

    @Column(length = 10)
    private String pan;

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false, length = 2)
    private String stateCode;

    @Column(length = 60)
    private String stateName;

    @Column(length = 3)
    @Builder.Default
    private String currency = "INR";

    @Column(length = 100)
    private String upiId;

    @Column(length = 20)
    @Builder.Default
    private String invoicePrefix = "INV/26-27/";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
