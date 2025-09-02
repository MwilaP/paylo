import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://jfntajeubvhmexoqfpau.supabase.co"
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbnRhamV1YnZobWV4b3FmcGF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA0MTgyOCwiZXhwIjoyMDY0NjE3ODI4fQ.EfQpECjdlC0ZZZDo7aov7Bz5D1fyYik-CRJH5RJFC-k"

// Check if environment variables are defined
if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Error: Missing required environment variables.")
    console.error("Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

async function createAdminUser() {
    try {
        console.log("Creating admin user...")

        // Check if admin user already exists
        const { data: existingUser } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", "mwilamach@gmail.com")
            .single()

        if (existingUser) {
            console.log("Admin user already exists")
            return
        }

        // Create the admin user
        const { data, error } = await supabase.auth.admin.createUser({
            email: "mwilamach@gmail.com",
            password: "Surds@2207",
            email_confirm: true,
            // user_metadata: null, // Clear if not needed

            // Add metadata here:
            app_metadata: {  // For role/privileges
                roles: ["admin"]
            },

            // User-visible metadata:
            user_metadata: {
                full_name: "System Administrator"
            }
        })
        if (error) {
            console.error("Error creating admin user:", error)
            return
        }

        console.log("Admin user created successfully:", data.user?.email)

        // Update the profile with admin role
        if (data.user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    role: "admin",
                    full_name: "System Administrator",
                    department: "IT",
                })
                .eq("id", data.user.id)

            if (profileError) {
                console.error("Error updating profile:", profileError.message)
            } else {
                console.log("Admin profile updated successfully")
            }
        }
    } catch (error) {
        console.error("Unexpected error:", error)
    }
}

createAdminUser()
Address the login failure issue in the Supabase authentication process within the Vercel project. Investigate and resolve any potential causes, such as incorrect credentials, authentication configuration errors, or issues with the Supabase client setup. Ensure that the login functionality is secure, reliable, and correctly integrated with the user management system. Provide detailed steps to diagnose the problem, including checking the Supabase dashboard for authentication logs, verifying environment variables, and reviewing the client-side and server-side code related to authentication. Implement necessary fixes to ensure users can successfully log in and access the application's features