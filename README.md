# IMA Soluciones - Reporting Platform

A comprehensive Next.js-based reporting platform for IMA Soluciones with role-based authentication, dynamic dashboards, and specialized reporting modules for work and warehouse operations.

## 🚀 Features

### Role-Based Authentication & Navigation
- **Three User Roles**: Admin, Supervisor, Almacenista
- **Dynamic Navigation**: Sidebar and routes adapt based on user role
- **Access Control**: Frontend route protection with `RequireRole` component
- **Role Switching**: Test different roles via URL query params (`?role=admin`)

### Dashboard System
- **Admin Dashboard**: Unified view of all modules with purple theme
- **Supervisor Dashboard**: Work reports focus with blue theme
- **Warehouse Dashboard**: Warehouse operations focus with green theme
- Each dashboard includes stats cards, recent activity, and quick actions

### Work Reports Module
- **Create Reports**: `/reports/new` - Comprehensive form with live preview
- **View Reports**: `/reports` - List view with filtering
- **Report Details**: `/reports/[id]` - Read-only detailed view
- Features: Subsystem tracking, worker assignments, tools/parts inventory, signatures

### Warehouse Reports Module
- **Create Reports**: `/almacen/new` - Warehouse-specific form with preview
- **View Reports**: `/almacen` - List view with filtering
- **Report Details**: `/almacen/[id]` - Read-only detailed view
- Features: Tool/parts delivery tracking, multiple signatures, evidence photos

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Signatures**: React Signature Canvas

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── dashboard/           # Dashboard route
│   ├── reports/             # Work reports routes
│   └── almacen/             # Warehouse reports routes
├── auth/                     # Authentication & authorization
│   ├── roles.ts             # Role definitions
│   ├── useMockCurrentUser.ts # Mock auth hook
│   └── RequireRole.tsx      # Access control component
├── components/
│   ├── layout/              # AppLayout with dynamic nav
│   ├── reports/             # Work report components
│   ├── almacen/             # Warehouse components
│   └── ui/                  # Shared UI components
├── views/                    # Page-level components
│   ├── dashboards/          # Role-specific dashboards
│   ├── ReportsListPage.tsx
│   ├── WorkReportDetailPage.tsx
│   └── ...
├── mock/                     # Mock data for development
├── navigation/               # Navigation configuration
├── schema/                   # Zod validation schemas
├── theme/                    # Theme colors and config
└── types/                    # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/WhosAnder/IMA.git
cd IMA

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm run preview
```

## 👥 User Roles & Testing

### Role Labels
- **Admin**: "IMA Claude Admin"
- **Supervisor**: "IMA Claude Supervisor"  
- **Almacenista**: "IMA Colad Almacén"

### Test Different Roles

```
# Admin - Full access to all modules
http://localhost:3000/dashboard?role=admin

# Supervisor - Work reports only
http://localhost:3000/dashboard?role=supervisor

# Almacenista - Warehouse reports only
http://localhost:3000/dashboard?role=almacenista
```

## 🎨 Theming

The application uses role-based theming:
- **Admin**: Purple (`#6b21a8`)
- **Work Reports**: Blue (`#153A7A`)
- **Warehouse Reports**: Green (`#15803d`)

Theme colors are defined in `src/theme/colors.ts`.

## 📋 Available Routes

### Public Routes
- `/` - Landing page

### Dashboard
- `/dashboard` - Role-specific dashboard

### Work Reports
- `/reports` - List all work reports
- `/reports/new` - Create new work report
- `/reports/[id]` - View work report details

### Warehouse Reports
- `/almacen` - List all warehouse reports
- `/almacen/new` - Create new warehouse report
- `/almacen/[id]` - View warehouse report details

## 🔐 Access Control

Routes are protected based on user roles:

| Route | Admin | Supervisor | Almacenista |
|-------|-------|------------|-------------|
| `/dashboard` | ✅ | ✅ | ✅ |
| `/reports/*` | ✅ | ✅ | ❌ |
| `/almacen/*` | ✅ | ❌ | ✅ |

## 🧪 Development

### Mock Data
Mock data is available in `src/mock/`:
- `workReports.ts` - Sample work reports
- `warehouseReports.ts` - Sample warehouse reports

### Adding New Features
1. Create types in `src/types/`
2. Add schema validation in `src/schema/`
3. Create components in `src/components/`
4. Add views in `src/views/`
5. Configure routes in `src/app/`

## 🔄 Backend Integration (Future)

The application is structured for easy backend integration:
- Replace `useMockCurrentUser` with real auth
- Replace mock data imports with API calls
- Update `RequireRole` to use real permissions
- Add API routes in `src/app/api/`

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run build` to verify
4. Submit a pull request

## 📄 License

This project is proprietary software for IMA Soluciones.

## 🆘 Support

For issues or questions, please contact the development team.

