package com.apnibilling.modules.party.repository;

import com.apnibilling.modules.party.model.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PartyRepository extends JpaRepository<Party, UUID> {
    List<Party> findByTenantId(UUID tenantId);
    List<Party> findByTenantIdAndPartyType(UUID tenantId, String partyType);
}
