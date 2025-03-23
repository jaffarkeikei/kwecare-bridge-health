/**
 * Health Data Migration Utility
 * 
 * This utility handles secure data migration between healthcare providers
 * while maintaining Indigenous data sovereignty principles based on OCAP®
 * (Ownership, Control, Access, and Possession).
 */

import { toast } from "sonner";

export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  recordType: 'lab' | 'diagnosis' | 'medication' | 'vitals' | 'notes' | 'traditional';
  provider: string;
  content: Record<string, any>;
  permissions: RecordPermissions;
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    source: string;
    isTraditionalKnowledge?: boolean;
    knowledgeKeeper?: string;
    communityOrigin?: string;
  };
}

export interface RecordPermissions {
  owner: string; // Patient ID as the owner
  sharedWith: string[]; // Provider IDs
  viewableBy: 'patient' | 'providers' | 'community' | 'public';
  exportable: boolean;
  deletable: boolean;
  traditionalKnowledgeProtections?: boolean;
}

export interface MigrationOptions {
  includeTypes?: HealthRecord['recordType'][];
  dateRange?: {
    start: string;
    end: string;
  };
  destinationProvider: string;
  anonymizePersonalData?: boolean;
  encryptData?: boolean;
  requireExplicitConsent?: boolean;
  preserveOwnership?: boolean;
  respectTraditionalProtections?: boolean;
}

const DEFAULT_OPTIONS: Partial<MigrationOptions> = {
  anonymizePersonalData: false,
  encryptData: true,
  requireExplicitConsent: true,
  preserveOwnership: true,
  respectTraditionalProtections: true
};

/**
 * Prepares health records for migration between providers
 */
export const prepareDataMigration = (
  records: HealthRecord[],
  options: MigrationOptions
): { 
  eligibleRecords: HealthRecord[],
  protectedRecords: HealthRecord[],
  migrationPackage: any,
  consentForm: string
} => {
  // Merge provided options with defaults
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  // Filter records based on options
  const filteredRecords = records.filter(record => {
    // Filter by record type if specified
    if (mergedOptions.includeTypes && !mergedOptions.includeTypes.includes(record.recordType)) {
      return false;
    }
    
    // Filter by date range if specified
    if (mergedOptions.dateRange) {
      const recordDate = new Date(record.date);
      const startDate = new Date(mergedOptions.dateRange.start);
      const endDate = new Date(mergedOptions.dateRange.end);
      
      if (recordDate < startDate || recordDate > endDate) {
        return false;
      }
    }
    
    // Records must be exportable
    if (!record.permissions.exportable) {
      return false;
    }
    
    return true;
  });
  
  // Separate traditional knowledge with special protections
  const protectedRecords = filteredRecords.filter(
    record => record.metadata.isTraditionalKnowledge && 
              record.metadata.knowledgeKeeper &&
              record.permissions.traditionalKnowledgeProtections && 
              mergedOptions.respectTraditionalProtections
  );
  
  // Records eligible for migration
  const eligibleRecords = filteredRecords.filter(record => !protectedRecords.includes(record));
  
  // Process records for migration
  const processedRecords = eligibleRecords.map(record => {
    const processedRecord = { ...record };
    
    // Update permissions for the new provider
    processedRecord.permissions = {
      ...record.permissions,
      sharedWith: [...record.permissions.sharedWith, mergedOptions.destinationProvider]
    };
    
    // Anonymize if requested
    if (mergedOptions.anonymizePersonalData) {
      // This would be a more comprehensive anonymization in a real app
      if (processedRecord.content.personalNotes) {
        processedRecord.content.personalNotes = "[redacted for privacy]";
      }
    }
    
    // Update metadata
    processedRecord.metadata = {
      ...record.metadata,
      updatedAt: new Date().toISOString(),
      version: record.metadata.version + 1,
      source: `migration-from-${record.provider}-to-${mergedOptions.destinationProvider}`
    };
    
    return processedRecord;
  });
  
  // Create migration package (in a real app, this would be encrypted)
  const migrationPackage = {
    records: processedRecords,
    metadata: {
      createdAt: new Date().toISOString(),
      sourceProvider: eligibleRecords[0]?.provider || "unknown",
      destinationProvider: mergedOptions.destinationProvider,
      recordCount: processedRecords.length,
      patientId: eligibleRecords[0]?.patientId || "unknown",
      migrationId: `migration-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }
  };
  
  // Generate patient consent form
  const consentForm = generateConsentForm(
    eligibleRecords,
    protectedRecords,
    mergedOptions
  );
  
  return {
    eligibleRecords,
    protectedRecords,
    migrationPackage,
    consentForm
  };
};

/**
 * Executes the data migration after consent
 */
export const executeDataMigration = async (
  migrationPackage: any,
  patientConsent: boolean
): Promise<boolean> => {
  if (!patientConsent) {
    toast.error("Data migration cancelled - patient consent required");
    return false;
  }
  
  try {
    // In a real app, this would:
    // 1. Encrypt the data package
    // 2. Send it to the destination provider's system
    // 3. Wait for confirmation
    // 4. Log the successful transfer
    
    // Simulate the API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${migrationPackage.records.length} records successfully transferred to ${migrationPackage.metadata.destinationProvider}`);
    
    // Log the migration in patient's activity
    console.log(`Migration ${migrationPackage.metadata.migrationId} completed at ${new Date().toISOString()}`);
    
    return true;
  } catch (error) {
    console.error("Data migration failed:", error);
    toast.error("Data migration failed. Please try again.");
    return false;
  }
};

/**
 * Generates a consent form for the patient based on the records being migrated
 */
const generateConsentForm = (
  eligibleRecords: HealthRecord[],
  protectedRecords: HealthRecord[],
  options: MigrationOptions
): string => {
  // This would generate a proper legal consent form in a real app
  return `
PATIENT HEALTH DATA MIGRATION CONSENT FORM

I consent to the transfer of ${eligibleRecords.length} health records to ${options.destinationProvider}.

${eligibleRecords.length > 0 ? `Records include: ${[...new Set(eligibleRecords.map(r => r.recordType))].join(', ')}` : ''}

${protectedRecords.length > 0 ? 
  `NOTE: ${protectedRecords.length} records containing traditional knowledge will NOT be transferred without specific additional consent from the original knowledge keeper(s).` : ''}

I understand that:
- I maintain ownership of my health data
- I can revoke access to this data at any time
- This transfer is encrypted and secure
- My data sovereignty rights are preserved

To consent, please check the consent box and provide your signature.
`;
};

/**
 * Imports health records from a migration package
 */
export const importHealthRecords = async (
  migrationPackage: any,
  providerVerification: boolean
): Promise<boolean> => {
  if (!providerVerification) {
    toast.error("Records import cancelled - provider verification required");
    return false;
  }
  
  try {
    // In a real app, this would:
    // 1. Decrypt the migration package
    // 2. Verify the data integrity
    // 3. Import into the local system
    // 4. Send confirmation to the source provider
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${migrationPackage.records.length} records successfully imported from ${migrationPackage.metadata.sourceProvider}`);
    
    return true;
  } catch (error) {
    console.error("Health records import failed:", error);
    toast.error("Records import failed. Please try again.");
    return false;
  }
}; 