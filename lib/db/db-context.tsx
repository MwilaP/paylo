"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { initializeDatabase } from "./db-service"
import { SyncService, RemoteSyncConfig, SyncInfo, createSyncService } from "./sync-service"
import { EmployeeService, createEmployeeService } from "./employee-service"

// Define the context type
interface DatabaseContextType {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  databases: any | null
  employeeService: EmployeeService | null
  syncService: SyncService | null
  syncConfig: RemoteSyncConfig
  setSyncConfig: (config: Partial<RemoteSyncConfig>) => void
  syncStatus: Record<string, SyncInfo>
}

// Create the context
const DatabaseContext = createContext<DatabaseContextType>({
  isInitialized: false,
  isLoading: true,
  error: null,
  databases: null,
  employeeService: null,
  syncService: null,
  syncConfig: { url: "" },
  setSyncConfig: () => {},
  syncStatus: {},
})

// Default sync configuration
const DEFAULT_SYNC_CONFIG: RemoteSyncConfig = {
  url: process.env.NEXT_PUBLIC_COUCHDB_URL || "http://localhost:5984",
  username: process.env.NEXT_PUBLIC_COUCHDB_USER,
  password: process.env.NEXT_PUBLIC_COUCHDB_PASSWORD,
  batchSize: 25,
  retry: true,
  retryDelay: 5000,
  compression: true
}

// Provider component
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [syncConfig, setSyncConfig] = useState<RemoteSyncConfig>(DEFAULT_SYNC_CONFIG)
  const [syncStatus, setSyncStatus] = useState<Record<string, SyncInfo>>({})
  const [state, setState] = useState<DatabaseContextType>({
    isInitialized: false,
    isLoading: true,
    error: null,
    databases: null,
    employeeService: null,
    syncService: null,
    syncConfig,
    setSyncConfig: (config: Partial<RemoteSyncConfig>) => setSyncConfig(prev => ({ ...prev, ...config })),
    syncStatus,
  })

  // Initialize database and services
  useEffect(() => {
    // Skip if we're not in a browser environment
    if (typeof window === "undefined") {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    let isMounted = true
    let intervalId: NodeJS.Timeout | null = null

    const initialize = async () => {
      try {
        console.log("Initializing database...")
        const { success, databases } = await initializeDatabase()

        // Create services if database initialization was successful
        let employeeService = null
        let syncService = null
        
        if (success && databases) {
          // Initialize sync service first
          const PouchDB = (window as any).PouchDB
          if (PouchDB) {
            syncService = createSyncService(PouchDB, syncConfig)
          }
          
          // Then create employee service with sync service
          employeeService = createEmployeeService(databases.employees, syncService)
          
          // Setup sync status monitoring
          if (syncService) {
            const updateSyncStatus = () => {
              const newStatus: Record<string, SyncInfo> = {}
              Object.values(databases).forEach((db: any) => {
                if (db && db.name) {
                  newStatus[db.name] = syncService!.getSyncInfo(db.name)
                }
              })
              setSyncStatus(newStatus)
            }
            
            // Initial status update
            updateSyncStatus()
            
            // Set up interval to update sync status
            intervalId = setInterval(updateSyncStatus, 5000)
          }
        }

        if (isMounted) {
          setState(prev => ({
            ...prev,
            isInitialized: !!success,
            isLoading: false,
            error: success ? null : "Failed to initialize database",
            databases,
            employeeService,
            syncService,
          }))

          if (success) {
            console.log("Database initialized successfully")
          } else {
            console.warn("Database initialization failed, app will run in fallback mode")
          }
        }
      } catch (err) {
        console.error("Error initializing database:", err)

        if (isMounted) {
          setState(prev => ({
            ...prev,
            isInitialized: false,
            isLoading: false,
            error: err instanceof Error ? err.message : "Unknown database error",
            databases: null,
            employeeService: null,
            syncService: null,
          }))
        }
      }
    }

    // Delay initialization to ensure it happens after hydration
    const timeoutId = setTimeout(() => {
      initialize()
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [syncConfig])

  // Update context when syncConfig or syncStatus changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      syncConfig,
      setSyncConfig: (config: Partial<RemoteSyncConfig>) => setSyncConfig(prev => ({ ...prev, ...config })),
      syncStatus,
    }))
  }, [syncConfig, syncStatus])

  return <DatabaseContext.Provider value={state}>{children}</DatabaseContext.Provider>
}

// Hook to use the database context
export function useDatabase() {
  return useContext(DatabaseContext)
}

// Hook to get database instances
export function useDatabases() {
  const { databases } = useDatabase()
  return (
    databases || {
      employees: null,
      payrollStructures: null,
      payrollHistory: null,
      settings: null,
      users: null,
    }
  )
}

// Hook to get sync service
export function useSyncService() {
  const { syncService, syncConfig, setSyncConfig, syncStatus } = useDatabase()
  return { syncService, syncConfig, setSyncConfig, syncStatus }
}

// Hook to start sync for a database
export function useSync(dbName: string) {
  const { databases, syncService, syncConfig } = useDatabase()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<Error | null>(null)
  
  // Start sync function
  const startSync = async () => {
    if (!syncService || !databases) {
      setSyncError(new Error("Sync service or databases not available"))
      return null
    }
    
    const db = databases[dbName.replace('payroll_', '')]
    if (!db) {
      setSyncError(new Error(`Database ${dbName} not found`))
      return null
    }
    
    try {
      setIsSyncing(true)
      setSyncError(null)
      return syncService.startSync(db, dbName, syncConfig)
    } catch (error) {
      setSyncError(error instanceof Error ? error : new Error(String(error)))
      return null
    } finally {
      setIsSyncing(false)
    }
  }
  
  // Stop sync function
  const stopSync = () => {
    if (syncService) {
      syncService.stopSync(dbName)
    }
  }
  
  // Sync once function
  const syncOnce = async (direction: "push" | "pull" | "both" = "both") => {
    if (!syncService || !databases) {
      setSyncError(new Error("Sync service or databases not available"))
      return null
    }
    
    const db = databases[dbName.replace('payroll_', '')]
    if (!db) {
      setSyncError(new Error(`Database ${dbName} not found`))
      return null
    }
    
    try {
      setIsSyncing(true)
      setSyncError(null)
      return await syncService.syncOnce(db, dbName, direction, syncConfig)
    } catch (error) {
      setSyncError(error instanceof Error ? error : new Error(String(error)))
      return null
    } finally {
      setIsSyncing(false)
    }
  }
  
  // Resolve conflicts function
  const resolveConflicts = async () => {
    if (!syncService || !databases) {
      setSyncError(new Error("Sync service or databases not available"))
      return 0
    }
    
    const db = databases[dbName.replace('payroll_', '')]
    if (!db) {
      setSyncError(new Error(`Database ${dbName} not found`))
      return 0
    }
    
    try {
      return await syncService.resolveConflicts(db)
    } catch (error) {
      setSyncError(error instanceof Error ? error : new Error(String(error)))
      return 0
    }
  }
  
  // Get sync info
  const getSyncInfo = () => {
    if (!syncService) return null
    return syncService.getSyncInfo(dbName)
  }
  
  return {
    startSync,
    stopSync,
    syncOnce,
    resolveConflicts,
    getSyncInfo,
    isSyncing,
    syncError
  }
}
