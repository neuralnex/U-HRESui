# U-HRES UI

Complete frontend interface for the Unified Health Record Exchange System.

## Features

- 🏥 **Doctor Dashboard** - Patient management, AI insights, consultations
- 🏢 **Hospital Admin Dashboard** - Staff management, interoperability monitoring
- 🧪 **Lab/Pharmacy Interface** - Lab result uploads, prescription management
- 🏛️ **Central Admin Panel** - System-wide monitoring and management
- 👤 **Patient Portal** (Optional) - Personal medical records access

## Tech Stack

- React 19
- TypeScript
- React Router
- Lucide Icons
- Vite

## Getting Started

### Installation

```bash
cd U-HRESui/client
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Design System

The UI follows a comprehensive design system with:

- **Colors**: Medical blue theme (#1C6DD0)
- **Typography**: Inter for body, Roboto Mono for data
- **Spacing**: Consistent 4px-based scale
- **Components**: Reusable, accessible components

See `src/styles/design-system.css` for all design tokens.

## Role-Based Access

The system supports 4 main roles:

1. **Doctor** (`/doctor`) - Patient care interface
2. **Hospital Admin** (`/admin`) - Hospital management
3. **Lab/Pharmacy** (`/lab`) - Lab results and prescriptions
4. **Central Admin** (`/central`) - System-wide administration

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Card, Input, etc.)
│   └── layout/          # Layout components (Navbar, Sidebar, MainLayout)
├── pages/
│   ├── auth/           # Login page
│   ├── doctor/          # Doctor dashboard and patient profile
│   ├── admin/           # Hospital admin dashboard
│   ├── lab/             # Lab/pharmacy interface
│   └── central/         # Central admin panel
└── styles/
    └── design-system.css # Design tokens and utilities
```

## API Integration

The UI is designed to integrate with the U-HRES backend API. Update API endpoints in:

- `src/services/api.ts` (to be created)
- Environment variables for API base URL

## Features by Role

### Doctor Dashboard
- Quick actions (search, register, consult, lab request, referral)
- AI highlights and alerts
- Today's patients list
- Patient profile with full medical history
- AI-generated clinical summaries
- Prescription and lab ordering

### Hospital Admin
- Staff management
- Interoperability monitoring
- Audit logs
- API usage and billing
- Inter-hospital transfer logs

### Lab/Pharmacy
- Lab result upload with AI extraction
- Prescription viewing and dispensing
- Drug interaction alerts

### Central Admin
- Hospital registry
- Node health monitoring
- AI performance dashboard
- System-wide analytics
- Revenue tracking

## Next Steps

1. Connect to backend API
2. Implement authentication
3. Add data fetching and state management
4. Implement real-time updates
5. Add patient portal (optional)
