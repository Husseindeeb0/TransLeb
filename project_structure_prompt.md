# Full Project Structure & Architecture Guide

Use this prompt to ensure that any new features or modules follow the established architecture and naming conventions.

---

### **1. Backend Architecture (Node.js/Express/Mongoose)**

The backend is organized by **Layered Concern**. All new features must follow this flow:

- **`src/models/`**: Define the Mongoose schema (e.g., `featureName.model.ts`).
- **`src/types/`**: Export TypeScript interfaces for models and requests (e.g., `featureNameTypes.ts`).
- **`src/controllers/`**: Implement business logic and DB operations (e.g., `featureName.controller.ts`).
- **`src/routes/`**: Define Express routes and link them to controllers (e.g., `featureName.route.ts`).
- **`src/middleware/`**: Place route-specific logic like `verifyJWT`.
- **`src/index.ts`**: Register new routes in the main application.

#### **Backend Naming & Code Style**
- Use camelCase for folder and file names (e.g., `auth.controller.ts`).
- Always use async/await with try-catch blocks in controllers.
- Return structured JSON responses with `state` and `message` (e.g., `{ state: "SUCCESS", message: "..." }`).

---

### **2. Frontend Architecture (React/Redux Toolkit/RTK Query)**

The frontend is built for **Scalability and Real-time interactivity**.

- **`src/pages/`**: Create a folder for each page (e.g., `Profile/index.tsx`). Pages should be clean and primarily handle state/dispatching.
- **`src/components/`**: Place reusable UI components here.
- **`src/state/services/`**: Use RTK Query for all API interactions. Create a dedicated folder for each backend module (e.g., `auth/authAPI.ts`).
- **`src/lib/`**: Configuration for external libraries like `axios` (with `withCredentials: true`).

#### **Frontend Naming & Code Style**
- Use PascalCase for components and page folders (e.g., `DayCard/`, `PshareLocation/`).
- Use RTK Query hooks (e.g., `useLoginMutation`) for all server state; avoid manual `useEffect` fetching.
- Use `framer-motion` for animations and `lucide-react`, `react-icons` for icons.

---

### **3. Adding a New Feature (Example)**
To add a "Booking" feature:
1.  **Backend**:
    - Create `models/Booking.ts`.
    - Create `controllers/booking.controller.ts`.
    - Create `routes/booking.route.ts`.
    - Register route in `index.ts`.
    - Create `types/bookTypes.ts`.
2.  **Frontend**:
    - Create `state/services/booking/bookingAPI.ts`.
    - Register the service in `state/store.ts`.
    - Create `pages/Bookings/index.tsx`.
    - Create `types/bookTypes.ts`.
    - Check for existing components that could be used without rewriting anything again.
