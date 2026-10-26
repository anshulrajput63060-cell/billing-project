package com.apnibilling.modules.product.repository;

import com.apnibilling.modules.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByTenantId(UUID tenantId);
    Optional<Product> findByTenantIdAndBarcode(UUID tenantId, String barcode);
    Optional<Product> findByTenantIdAndSku(UUID tenantId, String sku);
    List<Product> findByTenantIdAndCategory(UUID tenantId, String category);
}
