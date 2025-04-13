"use client"

import { v4 as uuidv4 } from "uuid"
import { dbOperations } from "../db-service"

// Payroll history service factory
export const payrollHistoryService = (db: any) => ({
  // Create a new payroll record
  async createPayrollRecord(payrollData: any) {
    if (!db) return null

    try {
      const id = payrollData._id || `payroll_${uuidv4()}`
      const payroll = {
        _id: id,
        status: "pending", // Default status
        ...payrollData,
        date: payrollData.date || new Date().toISOString(),
      }

      return await dbOperations.create(db, payroll)
    } catch (error) {
      console.error("Error creating payroll record:", error)
      return null
    }
  },

  // Get a payroll record by ID
  async getPayrollRecordById(id: string) {
    if (!db) return null

    try {
      return await dbOperations.getById(db, id)
    } catch (error) {
      console.error(`Error getting payroll record with ID ${id}:`, error)
      return null
    }
  },

  // Update a payroll record
  async updatePayrollRecord(id: string, updates: any) {
    if (!db) return null

    try {
      return await dbOperations.update(db, id, updates)
    } catch (error) {
      console.error(`Error updating payroll record with ID ${id}:`, error)
      return null
    }
  },

  // Delete a payroll record
  async deletePayrollRecord(id: string) {
    if (!db) return null

    try {
      return await dbOperations.delete(db, id)
    } catch (error) {
      console.error(`Error deleting payroll record with ID ${id}:`, error)
      return null
    }
  },

  // Get all payroll records
  async getAllPayrollRecords() {
    if (!db) return []

    try {
      return await dbOperations.getAll(db)
    } catch (error) {
      console.error("Error getting all payroll records:", error)
      return []
    }
  },

  // Get payroll records by employee ID
  async getPayrollRecordsByEmployee(employeeId: string) {
    if (!db) return []

    try {
      const result = await dbOperations.find(db, {
        selector: {
          employeeId: employeeId,
        },
      })

      return result.docs
    } catch (error) {
      console.error(`Error getting payroll records for employee ${employeeId}:`, error)
      return []
    }
  },

  // Get payroll records by date range
  async getPayrollRecordsByDateRange(startDate: string, endDate: string) {
    if (!db) return []

    try {
      const result = await dbOperations.find(db, {
        selector: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      })

      return result.docs
    } catch (error) {
      console.error(`Error getting payroll records by date range:`, error)
      return []
    }
  },

  // Get payroll records by status
  async getPayrollRecordsByStatus(status: string) {
    if (!db) return []

    try {
      const result = await dbOperations.find(db, {
        selector: {
          status: status,
        },
      })

      return result.docs
    } catch (error) {
      console.error(`Error getting payroll records with status ${status}:`, error)
      return []
    }
  },

  // Process payroll (change status from pending to processed)
  async processPayroll(id: string) {
    if (!db) return null

    try {
      return await this.updatePayrollRecord(id, {
        status: "processed",
        processedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error(`Error processing payroll record ${id}:`, error)
      return null
    }
  },

  // Bulk process payroll records
  async bulkProcessPayroll(ids: string[]) {
    if (!db) return []

    try {
      const payrolls = await Promise.all(ids.map((id) => this.getPayrollRecordById(id)))

      const updatedPayrolls = payrolls
        .filter((payroll) => payroll !== null)
        .map((payroll) => ({
          ...payroll,
          status: "processed",
          processedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))

      return await dbOperations.bulkDocs(db, updatedPayrolls)
    } catch (error) {
      console.error(`Error bulk processing payroll records:`, error)
      return []
    }
  },
})
