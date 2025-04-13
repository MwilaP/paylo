"use client"

import { getDatabases, dbOperations, initializeTestUser } from "@/lib/db/db-service"

// Session type definition
export interface User {
  _id: string
  username: string
  email: string
  name: string
  role: string
}

export interface Session {
  user: User | null
  isLoggedIn: boolean
  expires: string
}

// Initialize the auth system and create test user if needed
export const initializeAuth = async (): Promise<boolean> => {
  try {
    return await initializeTestUser()
  } catch (error) {
    console.error("Error initializing auth:", error)
    return false
  }
}

// Login function
export const login = async (
  usernameOrEmail: string,
  password: string
): Promise<{ success: boolean; session: Session | null; error?: string }> => {
  try {
    const { users } = await getDatabases()

    if (!users) {
      return { success: false, session: null, error: "Authentication system not available" }
    }

    // Find user by username or email
    const result = await dbOperations.find(users, {
      selector: {
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    })

    if (!result.docs || result.docs.length === 0) {
      return { success: false, session: null, error: "Invalid credentials" }
    }

    const user = result.docs[0]

    // Check password (in a real app, this would use proper password hashing)
    if (user.password !== password) {
      return { success: false, session: null, error: "Invalid credentials" }
    }

    // Create session
    const session: Session = {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      isLoggedIn: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    }

    // Store session in localStorage
    localStorage.setItem("paylo_session", JSON.stringify(session))

    return { success: true, session }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, session: null, error: "Authentication failed" }
  }
}

// Logout function
export const logout = (): void => {
  localStorage.removeItem("paylo_session")
}

// Get current session
export const getSession = (): Session | null => {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const sessionData = localStorage.getItem("paylo_session")
    if (!sessionData) {
      return null
    }

    const session = JSON.parse(sessionData) as Session

    // Check if session is expired
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem("paylo_session")
      return null
    }

    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const session = getSession()
  return !!session?.isLoggedIn
}

// Get current user
export const getCurrentUser = (): User | null => {
  const session = getSession()
  return session?.user || null
}