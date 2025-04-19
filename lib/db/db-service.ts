"use client"

// Import types from pouchdb.d.ts

// PouchDB instances
let PouchDB: any = null
let PouchDBFind: any = null
let PouchDBCompression: any = null

// Database instances
let employeesDb: any = null
let payrollStructuresDb: any = null
let payrollHistoryDb: any = null
let settingsDb: any = null
let usersDb: any = null // Added for user authentication

// Database names
export const DB_NAMES = {
  EMPLOYEES: "payroll_employees",
  PAYROLL_STRUCTURES: "payroll_structures",
  PAYROLL_HISTORY: "payroll_history",
  SETTINGS: "payroll_settings",
  USERS: "payroll_users", // Added for user authentication
}

// Flag to track initialization attempts
let initializationAttempted = false
let initializationSuccessful = false

// Network status tracking
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { isOnline = true })
  window.addEventListener('offline', () => { isOnline = false })
}

// Initialize PouchDB with better error handling and plugins
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
    
    // Load compression plugin for low-bandwidth optimization
    try {
      console.log("Attempting to load pouchdb-adapter-memory and compression plugins...")
      
      // Load compression plugin
      const compressionModule = await import("pouchdb-adapter-memory").catch((err) => {
        console.error("Error importing pouchdb-adapter-memory:", err)
        return { default: null }
      })
      
      PouchDBCompression = compressionModule.default
      
      if (PouchDBCompression) {
        console.log("Registering compression plugin...")
        PouchDB.plugin(PouchDBCompression)
        console.log("Compression plugin registered successfully")
      } else {
        console.warn("Compression plugin not available, bandwidth optimization will be limited")
      }
    } catch (pluginError) {
      console.error("Error loading compression plugin:", pluginError)
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
    
    // Configure database options for better performance
    const options = {
      auto_compaction: true,  // Automatically compact the database
      revs_limit: 100,        // Limit revision history to save space
      adapter: 'idb',         // Use IndexedDB adapter for better performance
    }
    
    const db = new PouchDB(dbName, options)
    
    // Add database name as a property for easier identification
    db.name = dbName
    
    return db
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
    usersDb = await createDatabase(DB_NAMES.USERS)

    // Check if all databases were created successfully
    if (!employeesDb || !payrollStructuresDb || !payrollHistoryDb || !settingsDb || !usersDb) {
      console.error("Failed to create one or more databases")
      return {
        success: false,
        databases: {
          employees: employeesDb,
          payrollStructures: payrollStructuresDb,
          payrollHistory: payrollHistoryDb,
          settings: settingsDb,
          users: usersDb,
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
            .catch((err: any) => console.warn("Error creating employees index:", err))
        }

        // Create indexes for payroll structures
        if (payrollStructuresDb) {
          await payrollStructuresDb
            .createIndex({
              index: { fields: ["name"] },
            })
            .catch((err: any) => console.warn("Error creating payroll structures index:", err))
        }

        // Create indexes for payroll history
        if (payrollHistoryDb) {
          await payrollHistoryDb
            .createIndex({
              index: { fields: ["date", "employeeId"] },
            })
            .catch((err: any) => console.warn("Error creating payroll history index:", err))
            
        // Create indexes for users
        if (usersDb) {
          await usersDb
            .createIndex({
              index: { fields: ["username", "email"] },
            })
            .catch((err: any) => console.warn("Error creating users index:", err))
        }
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
        users: usersDb,
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
      users: null,
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
        users: null,
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
    users: usersDb,
  }
}

// Check if we're online
export const checkOnlineStatus = (): boolean => {
  return isOnline
}

// Wait for online status
export const waitForOnline = async (
  timeout = 30000,
  checkInterval = 1000
): Promise<boolean> => {
  if (isOnline) return true
  
  return new Promise((resolve) => {
    const startTime = Date.now()
    const intervalId = setInterval(() => {
      if (isOnline) {
        clearInterval(intervalId)
        resolve(true)
        return
      }
      
      if (Date.now() - startTime > timeout) {
        clearInterval(intervalId)
        resolve(false)
      }
    }, checkInterval)
  })
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

// Queue for offline operations
interface QueuedOperation {
  type: 'create' | 'update' | 'delete' | 'bulkDocs'
  dbName: string
  data: any
  timestamp: number
}

let operationsQueue: QueuedOperation[] = []

// Process queued operations when online
const processQueue = async () => {
  if (!isOnline || operationsQueue.length === 0) return
  
  console.log(`Processing ${operationsQueue.length} queued operations`)
  
  const dbInstances = await getDatabases()
  const databases = dbInstances as any
  if (!databases) return
  
  // Process operations in order
  const operations = [...operationsQueue]
  operationsQueue = []
  
  for (const op of operations) {
    try {
      const db = databases[op.dbName.replace('payroll_', '')]
      if (!db) continue
      
      switch (op.type) {
        case 'create':
          await dbOperations.create(db, op.data)
          break
        case 'update':
          await dbOperations.update(db, op.data._id, op.data)
          break
        case 'delete':
          await dbOperations.delete(db, op.data._id)
          break
        case 'bulkDocs':
          await dbOperations.bulkDocs(db, op.data)
          break
      }
    } catch (error) {
      console.error(`Error processing queued operation:`, error)
      // Re-queue failed operation
      operationsQueue.push(op)
    }
  }
}

// Set up queue processing when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processQueue()
  })
}

// Safe database operations with fallbacks and offline support
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

      // If offline, queue the operation
      if (!isOnline) {
        console.log("Offline: Queueing create operation")
        operationsQueue.push({
          type: 'create',
          dbName: db.name,
          data: docToSave,
          timestamp: Date.now()
        })
        return { ...docToSave, _queued: true }
      }

      const response = await db.put(docToSave)
      return { ...docToSave, _rev: response.rev }
    } catch (error: any) {
      // If conflict, try to resolve
      if (error.name === 'conflict') {
        try {
          const existingDoc = await db.get(doc._id)
          const mergedDoc = {
            ...existingDoc,
            ...doc,
            updatedAt: new Date().toISOString()
          }
          const response = await db.put(mergedDoc)
          return { ...mergedDoc, _rev: response.rev }
        } catch (mergeError) {
          console.error("Error resolving conflict:", mergeError)
        }
      }
      
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
      // If offline, queue the operation
      if (!isOnline) {
        console.log("Offline: Queueing update operation")
        operationsQueue.push({
          type: 'update',
          dbName: db.name,
          data: { _id: id, ...updates },
          timestamp: Date.now()
        })
        return { _id: id, ...updates, _queued: true }
      }

      const doc = await db.get(id)
      const updatedDoc = {
        ...doc,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      const response = await db.put(updatedDoc)
      return { ...updatedDoc, _rev: response.rev }
    } catch (error: any) {
      // If conflict, try to resolve
      if (error.name === 'conflict') {
        try {
          const latestDoc = await db.get(id)
          const resolvedDoc = {
            ...latestDoc,
            ...updates,
            updatedAt: new Date().toISOString()
          }
          const response = await db.put(resolvedDoc)
          return { ...resolvedDoc, _rev: response.rev }
        } catch (resolveError) {
          console.error(`Error resolving conflict for document ${id}:`, resolveError)
        }
      }
      
      console.error(`Error updating document with ID ${id}:`, error)
      return null
    }
  },

  // Delete a document
  async delete(db: any, id: string) {
    if (!db) return mockDbOperations.delete()

    try {
      // If offline, queue the operation
      if (!isOnline) {
        console.log("Offline: Queueing delete operation")
        operationsQueue.push({
          type: 'delete',
          dbName: db.name,
          data: { _id: id },
          timestamp: Date.now()
        })
        return { ok: true, id, _queued: true }
      }

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
      return result.rows.map((row: any) => row.doc)
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
      
      // If offline, queue the operation
      if (!isOnline) {
        console.log("Offline: Queueing bulk operation")
        operationsQueue.push({
          type: 'bulkDocs',
          dbName: db.name,
          data: docsToSave,
          timestamp: Date.now()
        })
        return docsToSave.map(doc => ({ ok: true, id: doc._id, _queued: true }))
      }
      
      // Use compression if available for large batches
      if (docsToSave.length > 10 && PouchDBCompression) {
        console.log(`Using compression for bulk operation with ${docsToSave.length} documents`)
        // Compress the documents before sending
        const compressedDocs = docsToSave.map(doc => {
          // Simple compression: remove null/undefined values
          return Object.entries(doc).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined) {
              acc[key] = value
            }
            return acc
          }, {} as any)
        })
        
        return await db.bulkDocs(compressedDocs)
      }
      
      return await db.bulkDocs(docsToSave)
    } catch (error) {
      console.error("Error performing bulk operation:", error)
      return []
    }
  },
}

// Initialize the users database with a test user
export const initializeTestUser = async () => {
  try {
    // Get the users database
    const { users } = await getDatabases();
    
    if (!users) {
      console.error("Users database not available");
      return false;
    }
    
    // Check if the test user already exists
    const result = await dbOperations.find(users, {
      selector: {
        $or: [
          { username: "testuser" },
          { email: "testuser@example.com" }
        ]
      }
    });
    
    if (result.docs && result.docs.length > 0) {
      console.log("Test user already exists");
      return true;
    }
    
    // Create the test user
    const testUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "securepass123", // In a real app, this would be hashed
      role: "admin",
      name: "Test User",
    };
    
    const created = await dbOperations.create(users, testUser);
    
    if (created) {
      console.log("Test user created successfully");
      return true;
    } else {
      console.error("Failed to create test user");
      return false;
    }
  } catch (error) {
    console.error("Error initializing test user:", error);
    return false;
  }
};

// Export the operations queue for testing
export const getOperationsQueue = () => [...operationsQueue]

// Clear the operations queue
export const clearOperationsQueue = () => {
  operationsQueue = []
}

// Process queued operations manually
export const processOperationsQueue = async () => {
  return await processQueue()
}
