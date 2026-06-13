# High-Fidelity Authentication Architecture Prompt

Use this detailed prompt to build a secure JWT-based authentication system using Node.js/Express (Backend) and React (Frontend).

---

### **Overview**
Build a secure authentication system based on a **Dual-Token** strategy with **Silent Refresh** and **Token Rotation**. 

---

### **1. Backend Requirements (Express/Node.js)**

#### **A. Strict Type Management (`src/types/authTypes.ts`)**
Define clear interfaces for every request and response:
- `TokenPayload`: `{ id: string, name: string, email: string, role: string, iat?: number, exp?: number }`.
- `SigninRequest`, `SignupRequest`: Exactly match the expected body fields.
- `AuthResponse`: `{ _id: string, name: string, email: string, role: string, message: string }`.
- `ApiResponse`: Standard envelope for all JSON responses: `{ state: string, message: string }`.

#### **B. Token Lifecycle Utility (`src/utils/index.ts`)**
- Create a `verifyToken(token, type: "access" | "refresh")` function that uses `jwt.verify` inside a try-catch. Return the decoded `TokenPayload` or `null`. **Never throw errors directly in the middleware.**
- `generateToken` (1h expiry) and `generateRefreshToken` (e.g., 24h expiry).
- `setTokenCookies(res, accessToken, refreshToken)`: Use `HttpOnly`, `Secure: process.env.NODE_ENV === "production"`, `sameSite: "lax"`.

#### **C. The Flat Logic Middleware (verifyJWT in `src/middleware/index.ts`)**
The middleware MUST follow this flat logic flow (no nested if-statements). Use `let` for variables:

1.  **Initialize**: Get `accessToken` and `refreshToken` from `req.cookies`.
2.  **Auth Check**: If both are missing, return `401 AUTH_REQUIRED`.
3.  **Attempt Access Token**: `let decoded = accessToken ? verifyToken(accessToken, "access") : null;`.
4.  **Silent Refresh Fallback**: 
    - `if (!decoded && refreshToken)`:
        - `const refreshDecoded = verifyToken(refreshToken, "refresh");`
        - If `refreshDecoded` is valid:
            - Find user in DB by `id` from `refreshDecoded`.
            - **Strict DB Check**: `if (user && user.refreshToken === refreshToken)`.
            - **Rotate Tokens**: Generate new access/refresh pair, set new cookies, update user.refreshToken in DB and save.
            - **Assign**: `decoded = verifyToken(newAccessToken, "access");`
5.  **Final Verification**:
    - `if (!decoded || !("id" in decoded))`: Return `401 INVALID_TOKEN` with message "Invalid or expired session".
    - `req.userId = decoded.id;`
    - `next();`

#### **D. Controllers (auth.controller.ts)**
- **Signup/Signin**: Return full `AuthResponse`. Ensure `refreshToken` is saved to DB.
- **Logout**: Clear cookies, set `refreshToken: ""` in DB, return success message.

---

### **2. Frontend Requirements (React / Axios / RTK Query)**

#### **A. Global Axios Instance (`src/lib/axios/axiosInstance.ts`)**
- Set `withCredentials: true` globally.
- Use `import.meta.env.VITE_API_BASE_URL` for `baseURL`.

#### **B. RTK Query Service (`src/state/services/auth/authAPI.ts`)**
- Use `axiosBaseQuery()` as the base.
- Implement `login`, `signup`, `logout` mutations.
- Implement `checkAuth` query that calls `/user/me`.
- **Note**: Because of the Silent Refresh Middleware, the frontend **NEVER** receives a 401 for an expired access token—only for an expired session (both tokens invalid). No manual interceptors are needed.

---

### **3. Security Checkpoints**
- **No Client Storage**: Tokens are NEVER kept in `localStorage` or memory.
- **Refresh Token Rotation**: Each refresh request MUST replace the old refresh token with a new one.
- **Flat Middleware**: The middleware logic must be readable and easy to debug.
