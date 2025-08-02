# Environmental Impact Assessment System

This feature integrates a comprehensive environmental impact assessment system that calculates CO2 emissions and other environmental specifications for products, displaying green badges to indicate eco-friendly products.

## Features

### 1. Environmental Metrics Calculation

- **CO2 Emissions**: Calculated based on material type, weight, and manufacturing location
- **Water Footprint**: Water consumption during production
- **Energy Consumption**: Energy required for manufacturing
- **Recyclability Score**: Percentage indicating how recyclable the product is
- **Eco-Friendly Score**: Overall environmental impact score (0-100)

### 2. Material Impact Factors

The system considers different materials with varying environmental impacts:

#### Low Impact Materials (Eco-Friendly)

- Bamboo: 1.8 kg CO2e/kg
- Hemp: 1.9 kg CO2e/kg
- Organic Cotton: 1.8 kg CO2e/kg
- Linen: 2.1 kg CO2e/kg

#### Medium Impact Materials

- Cotton: 2.5 kg CO2e/kg
- Steel: 1.8 kg CO2e/kg
- Wool: 13.3 kg CO2e/kg

#### High Impact Materials

- Polyester: 5.5 kg CO2e/kg
- Nylon: 6.4 kg CO2e/kg
- Aluminum: 8.1 kg CO2e/kg
- Electronics (Silicon): 12.5 kg CO2e/kg

### 3. Manufacturing Location Impact

Different countries have varying environmental regulations and practices:

- Germany: 0.7x multiplier (best practices)
- USA: 0.8x multiplier
- India: 1.0x multiplier (baseline)
- China: 1.2x multiplier
- Bangladesh: 1.3x multiplier (higher impact)

### 4. Environmental Badges

Products are categorized with visual badges:

- 🌱 **Eco Champion** (90-100 score)
- 🌿 **Green Choice** (80-89 score)
- ♻️ **Eco Friendly** (70-79 score)
- 🌍 **Moderate Impact** (50-69 score)
- ⚠️ **High Impact** (0-49 score)

## API Endpoints

### Environmental Impact Routes

- `GET /api/environmental/product/:productId` - Calculate environmental impact for specific product
- `POST /api/environmental/update-all` - Update environmental data for all products
- `GET /api/environmental/eco-friendly` - Get eco-friendly products
- `GET /api/environmental/category/:category` - Get environmental impact by category
- `POST /api/environmental/compare` - Compare environmental impact of multiple products

## Database Schema Updates

### Product Model Enhancements

```typescript
interface IProduct {
  // ... existing fields
  environmentalMetrics?: {
    co2Emissions: number;
    waterFootprint: number;
    energyConsumption: number;
    recyclabilityScore: number;
    ecoFriendlyScore: number;
    isEcoFriendly: boolean;
    environmentalBadge: string;
    sustainabilityFeatures: string[];
  };
}
```

## Components

### 1. EnvironmentalBadge Component

- Displays environmental status with color-coded badges
- Shows detailed metrics when expanded
- Includes sustainability features list

### 2. EnvironmentalImpact Page

- Dashboard showing eco-friendly products
- Category-wise environmental impact analysis
- Environmental tips and best practices

### 3. Updated ProductCard

- Integrated environmental badges
- Shows eco-friendly status prominently

## Usage

### 1. Update All Products

```bash
# Run the update script
npm run update-environmental-data
```

### 2. Access Environmental Dashboard

Navigate to `/environmental-impact` to view:

- Eco-friendly products
- Category environmental analysis
- Environmental tips

### 3. API Usage

```javascript
// Get eco-friendly products
const response = await fetch("/api/environmental/eco-friendly?page=1&limit=20");

// Calculate impact for specific product
const impact = await fetch("/api/environmental/product/product-id");

// Compare multiple products
const comparison = await fetch("/api/environmental/compare", {
  method: "POST",
  body: JSON.stringify({ productIds: ["id1", "id2"] }),
});
```

## Environmental Scoring Algorithm

The eco-friendly score is calculated using:

- **Material Impact (40%)**: Based on material type and sustainability
- **Recyclability (25%)**: How easily the product can be recycled
- **CO2 Emissions (20%)**: Carbon footprint impact
- **Brand Reputation (10%)**: Known eco-friendly brands get bonus points
- **Category Impact (5%)**: Some categories are inherently more/less sustainable

## Sustainability Features

The system identifies and highlights:

- Organic materials
- Recycled content
- Bamboo products (sustainable)
- Hemp products (low impact)
- Highly recyclable materials
- Biodegradable materials

## Future Enhancements

1. **Lifecycle Assessment**: Include transportation and disposal impacts
2. **Certification Integration**: Connect with environmental certifications
3. **User Preferences**: Allow users to filter by environmental criteria
4. **Comparative Analysis**: Show environmental impact vs alternatives
5. **Carbon Offset Options**: Suggest carbon offset programs

## Technical Implementation

### Backend

- `server/utils/environmentalImpact.ts` - Core calculation logic
- `server/controllers/environmentalController.ts` - API controllers
- `server/routes/environmentalRoutes.ts` - API routes
- `server/models/Products.ts` - Updated schema

### Frontend

- `client/components/ui/environmental-badge.tsx` - Badge component
- `client/services/environmentalService.ts` - API service
- `client/pages/EnvironmentalImpact.tsx` - Dashboard page
- `client/components/product/ProductCard.tsx` - Updated product display

This system provides a comprehensive approach to environmental impact assessment, helping users make informed decisions about their purchases while promoting sustainability.
