# Cooking App - Phase 1: Foundation

A local-first cooking and grocery management application built with TypeScript, React, and Dexie.js.

## Phase 1 Features

- ✅ **Ingredient Management**: Add, edit, delete ingredients
- ✅ **Stock Tracking**: Track current inventory quantities
- ✅ **Buy Action**: Record purchases with automatic freshness tracking
- ✅ **Spoilage Engine**: Automatic expiry detection (Fresh, Near Expiry, Expired)
- ✅ **Local Storage**: All data persists in IndexedDB (offline-first)
- ✅ **No Account Required**: Single-user, local-only

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Storage**: Dexie.js (IndexedDB wrapper)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd cooking-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── actions/          # Workflow actions (mutations)
│   ├── buyIngredient.ts
│   └── ingredientCrud.ts
├── components/       # React UI components
│   ├── BuyIngredientDialog.tsx
│   ├── ConfirmDialog.tsx
│   ├── IngredientCard.tsx
│   ├── IngredientForm.tsx
│   ├── IngredientList.tsx
│   ├── Modal.tsx
│   ├── SpoilageBadge.tsx
│   └── SpoilageSummary.tsx
├── db/               # Database configuration
│   └── database.ts
├── engines/          # Pure logic engines
│   └── spoilage.ts
├── entities/         # Type definitions
│   └── ingredient.ts
├── pages/            # Page components
│   └── IngredientsPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## Architecture

### Entities (Data Model)

**Ingredient**
- `id`: Unique identifier
- `name`: Ingredient name
- `unit`: Unit of measurement
- `stockQty`: Current quantity in stock
- `shelfLifeDays`: Days until expiry from purchase
- `purchasedAt`: Last purchase timestamp (ISO string)

### Engines (Pure Logic)

**Spoilage Engine**
- Computes expiry date from `purchasedAt + shelfLifeDays`
- Determines spoilage status: Fresh, NearExpiry, Expired, Unknown
- Never mutates data - pure functions only

### Actions (Mutations)

**Buy Ingredient**
- Increments `stockQty`
- Updates `purchasedAt` to current timestamp
- Executes atomically in a transaction

## Usage Guide

### Adding an Ingredient

1. Click "Add Ingredient" button
2. Fill in name, unit, and shelf life
3. Click "Add Ingredient"

### Recording a Purchase

1. Click "Buy" on any ingredient card
2. Enter quantity purchased
3. Click "Record Purchase"
4. Stock and freshness tracking update automatically

### Understanding Spoilage Status

- 🟢 **Fresh**: More than 3 days until expiry
- 🟡 **Expiring Soon**: 3 days or less until expiry
- 🔴 **Expired**: Past expiry date
- ⚪ **Unknown**: No purchase recorded yet

### Sorting by Expiry

Click "Sort by expiry" to see items that need attention first.

## Data Persistence

All data is stored locally in your browser using IndexedDB:
- ✅ Survives page refresh
- ✅ Survives browser close
- ❌ Does not sync between devices
- ❌ Lost if browser data is cleared

## Next Phases

- **Phase 2**: Dishes + Availability Engine
- **Phase 3**: Quantity Aggregation + Shopping List
- **Phase 4**: Intermediate Preparations
- **Phase 5**: Shops + Prices
- **Phase 6**: Import/Export (JSON backup)

## License

Private - Personal Use Only
