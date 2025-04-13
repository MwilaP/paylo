"use client"

import { DB_NAMES, getDatabases, dbOperations } from "@/lib/db/db-service";
import { z } from "zod";

// Define schemas for allowances and deductions
const allowanceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(["fixed", "percentage"]),
  value: z.number().min(0, { message: "Value must be a positive number" })
});

const deductionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(["fixed", "percentage"]),
  value: z.number().min(0, { message: "Value must be a positive number" }),
  preTax: z.boolean().default(true)
});

// Payroll structure schema (matches the form structure)
export const payrollStructureSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  frequency: z.string({
    required_error: "Please select a payment frequency.",
  }),
  basicSalary: z.number().min(0, { message: "Basic salary must be a positive number" }),
  allowances: z.array(allowanceSchema),
  deductions: z.array(deductionSchema)
});

// TypeScript type for payroll structure
export type PayrollStructureData = z.infer<typeof payrollStructureSchema>;

// Interface for payroll structure document
export interface PayrollStructureDocument extends PayrollStructureData {
  _id: string;
  _rev?: string;
  createdAt: string;
  updatedAt: string;
}

// Create a new payroll structure
export async function createPayrollStructure(
  data: PayrollStructureData
): Promise<PayrollStructureDocument | null> {
  try {
    // Validate the data against the schema
    const validatedData = payrollStructureSchema.parse(data);
    
    // Get the database instance
    const { payrollStructures } = await getDatabases();
    
    if (!payrollStructures) {
      console.error("Payroll structures database not available");
      return null;
    }
    
    // Create the document
    return await dbOperations.create(payrollStructures, validatedData) as PayrollStructureDocument;
  } catch (error) {
    console.error("Error creating payroll structure:", error);
    return null;
  }
}

// Get a payroll structure by ID
export async function getPayrollStructure(
  id: string
): Promise<PayrollStructureDocument | null> {
  try {
    // Get the database instance
    const { payrollStructures } = await getDatabases();
    
    if (!payrollStructures) {
      console.error("Payroll structures database not available");
      return null;
    }
    
    // Get the document
    return await dbOperations.getById(payrollStructures, id) as PayrollStructureDocument;
  } catch (error) {
    console.error(`Error getting payroll structure with ID ${id}:`, error);
    return null;
  }
}

// Update a payroll structure
export async function updatePayrollStructure(
  id: string,
  updates: Partial<PayrollStructureData>
): Promise<PayrollStructureDocument | null> {
  try {
    // Validate the updates against the schema
    const validatedUpdates = payrollStructureSchema.partial().parse(updates);
    
    // Get the database instance
    const { payrollStructures } = await getDatabases();
    
    if (!payrollStructures) {
      console.error("Payroll structures database not available");
      return null;
    }
    
    // Update the document
    return await dbOperations.update(payrollStructures, id, validatedUpdates) as PayrollStructureDocument;
  } catch (error) {
    console.error(`Error updating payroll structure with ID ${id}:`, error);
    return null;
  }
}

// Delete a payroll structure
export async function deletePayrollStructure(
  id: string
): Promise<boolean> {
  try {
    // Get the database instance
    const { payrollStructures } = await getDatabases();
    
    if (!payrollStructures) {
      console.error("Payroll structures database not available");
      return false;
    }
    
    // Delete the document
    const result = await dbOperations.delete(payrollStructures, id);
    return result !== null;
  } catch (error) {
    console.error(`Error deleting payroll structure with ID ${id}:`, error);
    return false;
  }
}

// Get all payroll structures
export async function getAllPayrollStructures(): Promise<PayrollStructureDocument[]> {
  try {
    // Get the database instance
    const { payrollStructures } = await getDatabases();
    
    if (!payrollStructures) {
      console.error("Payroll structures database not available");
      return [];
    }
    
    // Get all documents
    return await dbOperations.getAll(payrollStructures) as PayrollStructureDocument[];
  } catch (error) {
    console.error("Error getting all payroll structures:", error);
    return [];
  }
}

// Query payroll structures
export async function queryPayrollStructures(
  query: any
): Promise<PayrollStructureDocument[]> {
  try {
    // Get the database instance
    const { payrollStructures } = await getDatabases();
    
    if (!payrollStructures) {
      console.error("Payroll structures database not available");
      return [];
    }
    
    // Query documents
    const result = await dbOperations.find(payrollStructures, query);
    return result.docs as PayrollStructureDocument[];
  } catch (error) {
    console.error("Error querying payroll structures:", error);
    return [];
  }
}

// Set up change listeners for real-time updates
export function subscribeToPayrollStructureChanges(
  callback: (change: any) => void
) {
  // This function will be implemented when we have the database instance
  // For now, we'll return a mock changes object with a cancel method
  const mockChanges = {
    cancel: () => {
      console.log("Cancelled changes subscription");
    }
  };
  
  // Asynchronously set up the real changes listener
  (async () => {
    try {
      const { payrollStructures } = await getDatabases();
      
      if (!payrollStructures) {
        console.error("Payroll structures database not available");
        return;
      }
      
      // Set up the changes listener
      const changes = payrollStructures.changes({
        since: 'now',
        live: true,
        include_docs: true
      });
      
      // Replace the mock cancel method with the real one
      mockChanges.cancel = () => changes.cancel();
      
      // Set up the change handler
      changes.on('change', callback);
    } catch (error) {
      console.error("Error setting up changes listener:", error);
    }
  })();
  
  return mockChanges;
}