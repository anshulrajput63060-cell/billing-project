package com.apnibilling.modules.product.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID tenantId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 60)
    private String sku;

    @Column(length = 60)
    private String barcode;

    @Column(length = 60)
    private String category;

    @Column(length = 20)
    @Builder.Default
    private String unit = "PCS";

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal purchasePrice = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal sellingPrice = BigDecimal.ZERO;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal gstRate = new BigDecimal("18.00");

    @Column(nullable = false, length = 10)
    private String hsnSac;

    @Column(nullable = false, precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(precision = 12, scale = 3)
    @Builder.Default
    private BigDecimal lowStockAlert = new BigDecimal("5.000");

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
