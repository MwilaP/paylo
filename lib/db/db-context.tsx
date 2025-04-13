"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { initializeDatabase } from "./db-service"

// Define the context type
interface DatabaseContextType {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  databases: any | null
}

// Create the context
const DatabaseContext = createContext<DatabaseContextType>({
  isInitialized: false,
  isLoading: true,
  error: null,
  databases: null,
})

// Provider component
export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DatabaseContextType>({
    isInitialized: false,
    isLoading: true,
    error: null,
    databases: null,
  })

  useEffect(() => {
    // Skip if we're not in a browser environment
    if (typeof window === "undefined") {
      setState((prev) => ({ ...prev, isLoading: false }))
      return
    }

    let isMounted = true

    const initialize = async () => {
      try {
        console.log("Initializing database...")
        const { success, databases } = await initializeDatabase()

        if (isMounted) {
          setState({
            isInitialized: success,
            isLoading: false,
            error: success ? null : "Failed to initialize database",
            databases,
          })

          if (success) {
            console.log("Database initialized successfully")
          } else {
            console.warn("Database initialization failed, app will run in fallback mode")
          }
        }
      } catch (err) {
        console.error("Error initializing database:", err)

        if (isMounted) {
          setState({
            isInitialized: false,
            isLoading: false,
            error: err instanceof Error ? err.message : "Unknown database error",
            databases: null,
          })
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
    }
  }, [])

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
    }
  )
}
