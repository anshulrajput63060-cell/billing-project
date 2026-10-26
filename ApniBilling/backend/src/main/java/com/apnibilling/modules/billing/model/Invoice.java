package com.apnibilling.modules.billing.model;

import com.apnibilling.modules.party.model.Party;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID tenantId;

    @Column(nullable = false, length = 50)
    private String invoiceNumber;

    @Column(nullable = false)
    private LocalDateTime invoiceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Party customer;

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(length = 20)
    private String customerPhone;

    @Column(length = 15)
    private String customerGstin;

    @Column(nullable = false)
    @Builder.Default
    private boolean isInterState = false;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal orderDiscount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal taxableAmount;

    @Column(nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal cgst = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal sgst = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    @Builder.Default
    private BigDecimal igst = BigDecimal.ZERO;

    @Column(precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal roundOff = BigDecimal.ZERO;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal grandTotal;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal paidAmount;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal balanceAmount;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String paymentMode = "CASH";

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PAID";

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
