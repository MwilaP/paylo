"use client"

// PouchDB instances
let PouchDB: any = null
let PouchDBFind: any = null

// Database instances
let employeesDb: any = null
let payrollStructuresDb: any = null
let payrollHistoryDb: any = null
let settingsDb: any = null

// Database names
export const DB_NAMES = {
  EMPLOYEES: "payroll_employees",
  PAYROLL_STRUCTURES: "payroll_structures",
  PAYROLL_HISTORY: "payroll_history",
  SETTINGS: "payroll_settings",
}

// Flag to track initialization attempts
let initializationAttempted = false
let initializationSuccessful = false

// Initialize PouchDB with better error handling
const initPouchDB = async () => {
  // Skip if already initialized successfully
  if (PouchDB) {
    return true
  }

  // Skip if not in browser
  if (typeof window === "undefined") {
    console.log("Skipping PouchDB initialization in server environment")
    return false
  }

  try {
    console.log("Attempting to load PouchDB...")

    // Use dynamic import with explicit error handling
    const pouchModule = await import("pouchdb").catch((err) => {
      console.error("Error importing PouchDB:", err)
      return { default: null }
    })

    PouchDB = pouchModule.default

    if (!PouchDB) {
      console.error("Failed to load PouchDB module")
      return false
    }

    console.log("PouchDB loaded successfully")

    // Load find plugin
    try {
      console.log("Attempting to load pouchdb-find plugin...")
      const findModule = await import("pouchdb-find").catch((err) => {
        console.error("Error importing pouchdb-find:", err)
        return { default: null }
      })

      PouchDBFind = findModule.default

      if (PouchDBFind) {
        console.log("Registering pouchdb-find plugin...")
        PouchDB.plugin(PouchDBFind)
        console.log("Plugin registered successfully")
      } else {
        console.warn("pouchdb-find plugin not available, search functionality will be limited")
      }
    } catch (pluginError) {
      console.error("Error loading pouchdb-find plugin:", pluginError)
      // Continue without the plugin
    }

    return true
  } catch (error) {
    console.error("Critical error initializing PouchDB:", error)
    return false
  }
}

// Create a database instance with error handling
const createDatabase = async (dbName: string) => {
  if (!PouchDB) {
    console.error(`Cannot create database ${dbName}: PouchDB not initialized`)
    return null
  }

  try {
    console.log(`Creating database: ${dbName}`)
    return new PouchDB(dbName)
  } catch (error) {
    console.error(`Error creating database ${dbName}:`, error)
    return null
  }
}

// Initialize all databases
export const initializeDatabase = async () => {
  // Skip if already attempted
  if (initializationAttempted) {
    return {
      success: initializationSuccessful,
      databases: {
        employees: employeesDb,
        payrollStructures: payrollStructuresDb,
        payrollHistory: payrollHistoryDb,
        settings: settingsDb,
      },
    }
  }

  initializationAttempted = true

  // Skip if not in browser
  if (typeof window === "undefined") {
    console.log("Skipping database initialization in server environment")
    return { success: false, databases: null }
  }

  try {
    // Initialize PouchDB
    const pouchInitialized = await initPouchDB()
    if (!pouchInitialized) {
      console.error("Failed to initialize PouchDB, cannot proceed with database initialization")
      return { success: false, databases: null }
    }

    // Create database instances
    employeesDb = await createDatabase(DB_NAMES.EMPLOYEES)
    payrollStructuresDb = await createDatabase(DB_NAMES.PAYROLL_STRUCTURES)
    payrollHistoryDb = await createDatabase(DB_NAMES.PAYROLL_HISTORY)
    settingsDb = await createDatabase(DB_NAMES.SETTINGS)

    // Check if all databases were created successfully
    if (!employeesDb || !payrollStructuresDb || !payrollHistoryDb || !settingsDb) {
      console.error("Failed to create one or more databases")
      return {
        success: false,
        databases: {
          employees: employeesDb,
          payrollStructures: payrollStructuresDb,
          payrollHistory: payrollHistoryDb,
          settings: settingsDb,
        },
      }
    }

    // Create indexes (with error handling)
    if (PouchDBFind) {
      try {
        console.log("Creating database indexes...")

        // Create indexes for employees
        if (employeesDb) {
          await employeesDb
            .createIndex({
              index: { fields: ["department", "status", "payrollStructureId"] },
            })
            .catch((err) => console.warn("Error creating employees index:", err))
        }

        // Create indexes for payroll structures
        if (payrollStructuresDb) {
          await payrollStructuresDb
            .createIndex({
              index: { fields: ["name"] },
            })
            .catch((err) => console.warn("Error creating payroll structures index:", err))
        }

        // Create indexes for payroll history
        if (payrollHistoryDb) {
          await payrollHistoryDb
            .createIndex({
              index: { fields: ["date", "employeeId"] },
            })
            .catch((err) => console.warn("Error creating payroll history index:", err))
        }

        console.log("Database indexes created successfully")
      } catch (indexError) {
        console.warn("Error creating indexes (non-fatal):", indexError)
      }
    } else {
      console.warn("PouchDB Find plugin not available, skipping index creation")
    }

    console.log("Database initialization completed successfully")
    initializationSuccessful = true

    return {
      success: true,
      databases: {
        employees: employeesDb,
        payrollStructures: payrollStructuresDb,
        payrollHistory: payrollHistoryDb,
        settings: settingsDb,
      },
    }
  } catch (error) {
    console.error("Error during database initialization:", error)
    return { success: false, databases: null }
  }
}

// Get database instances (with initialization if needed)
export const getDatabases = async () => {
  // Skip if not in browser
  if (typeof window === "undefined") {
    return {
      employees: null,
      payrollStructures: null,
      payrollHistory: null,
      settings: null,
    }
  }

  // Initialize if not already done
  if (!initializationAttempted) {
    console.log("Databases not initialized, initializing now...")
    const { success, databases } = await initializeDatabase()

    if (!success || !databases) {
      console.error("Failed to initialize databases on demand")
      return {
        employees: null,
        payrollStructures: null,
        payrollHistory: null,
        settings: null,
      }
    }

    return databases
  }

  // Return existing database instances
  return {
    employees: employeesDb,
    payrollStructures: payrollStructuresDb,
    payrollHistory: payrollHistoryDb,
    settings: settingsDb,
  }
}

// Mock database operations for when real database is not available
const mockDbOperations = {
  create: async () => {
    console.warn("Using mock database operation: create")
    return null
  },
  getById: async () => {
    console.warn("Using mock database operation: getById")
    return null
  },
  update: async () => {
    console.warn("Using mock database operation: update")
    return null
  },
  delete: async () => {
    console.warn("Using mock database operation: delete")
    return null
  },
  getAll: async () => {
    console.warn("Using mock database operation: getAll")
    return []
  },
  find: async () => {
    console.warn("Using mock database operation: find")
    return { docs: [] }
  },
  bulkDocs: async () => {
    console.warn("Using mock database operation: bulkDocs")
    return []
  },
}

// Safe database operations with fallbacks
export const dbOperations = {
  // Create a document
  async create(db: any, doc: any) {
    if (!db) return mockDbOperations.create()

    try {
      const timestamp = new Date().toISOString()
      const id = doc._id || crypto.randomUUID()

      const docToSave = {
        _id: id,
        ...doc,
        createdAt: doc.createdAt || timestamp,
        updatedAt: timestamp,
      }

      const response = await db.put(docToSave)
      return { ...docToSave, _rev: response.rev }
    } catch (error) {
      console.error("Error creating document:", error)
      return null
    }
  },

  // Get a document by ID
  async getById(db: any, id: string) {
    if (!db) return mockDbOperations.getById()

    try {
      return await db.get(id)
    } catch (error) {
      console.error(`Error getting document with ID ${id}:`, error)
      return null
    }
  },

  // Update a document
  async update(db: any, id: string, updates: any) {
    if (!db) return mockDbOperations.update()

    try {
      const doc = await db.get(id)
      const updatedDoc = {
        ...doc,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      const response = await db.put(updatedDoc)
      return { ...updatedDoc, _rev: response.rev }
    } catch (error) {
      console.error(`Error updating document with ID ${id}:`, error)
      return null
    }
  },

  // Delete a document
  async delete(db: any, id: string) {
    if (!db) return mockDbOperations.delete()

    try {
      const doc = await db.get(id)
      return await db.remove(doc)
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error)
      return null
    }
  },

  // Get all documents
  async getAll(db: any) {
    if (!db) return mockDbOperations.getAll()

    try {
      const result = await db.allDocs({
        include_docs: true,
      })
      return result.rows.map((row) => row.doc)
    } catch (error) {
      console.error("Error getting all documents:", error)
      return []
    }
  },

  // Find documents
  async find(db: any, query: any) {
    if (!db) return mockDbOperations.find()

    try {
      return await db.find(query)
    } catch (error) {
      console.error("Error finding documents:", error)
      return { docs: [] }
    }
  },

  // Bulk operations
  async bulkDocs(db: any, docs: any[]) {
    if (!db) return mockDbOperations.bulkDocs()

    try {
      const timestamp = new Date().toISOString()
      const docsToSave = docs.map((doc) => ({
        ...doc,
        updatedAt: timestamp,
        createdAt: doc.createdAt || timestamp,
      }))
      return await db.bulkDocs(docsToSave)
    } catch (error) {
      console.error("Error performing bulk operation:", error)
      return []
    }
  },
}
