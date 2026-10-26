package com.apnibilling.modules.billing.repository;

import com.apnibilling.modules.billing.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByTenantIdOrderByInvoiceDateDesc(UUID tenantId);
    Optional<Invoice> findByTenantIdAndInvoiceNumber(UUID tenantId, String invoiceNumber);
    long countByTenantId(UUID tenantId);
}
