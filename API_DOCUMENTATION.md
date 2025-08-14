# AGURA Ticketing System API Documentation

## Overview

The AGURA Ticketing System API provides comprehensive management for venues, events, sections, seats, ticket categories, and ticket purchases with robust security and validation.

## Base URL
```
Production: https://api.agura-ticketing.com
Development: https://dev-api.agura-ticketing.com
```

## Authentication
All requests require Bearer token authentication:
```
Authorization: Bearer <your-jwt-token>
```

## Core API Endpoints

### 1. Venues API
- `GET /api/venues` - Get all venues with filters
- `GET /api/venues/{id}` - Get venue by ID
- `GET /api/venues/city/{city}` - Get venues by city
- `GET /api/venues/country/{country}` - Get venues by country
- `GET /api/venues/search` - Search venues
- `GET /api/venues/popular` - Get popular venues
- `GET /api/venues/nearby` - Get venues near location

### 2. Sections API
- `GET /api/venues/{venueId}/sections` - Get sections by venue
- `GET /api/sections/{id}` - Get section by ID
- `GET /api/venues/{venueId}/sections/availability` - Get sections with availability
- `GET /api/sections/{id}/seat-map` - Get section seat map
- `GET /api/sections/{id}/stats` - Get section statistics
- `GET /api/sections/{id}/pricing` - Get section pricing

### 3. Seats API
- `GET /api/sections/{sectionId}/seats` - Get seats by section
- `GET /api/sections/{sectionId}/seats/availability` - Get seat availability
- `GET /api/sections/{sectionId}/seats/available` - Get available seats
- `GET /api/sections/{sectionId}/seats/occupied` - Get occupied seats
- `GET /api/sections/{sectionId}/seats/special` - Get special seats
- `GET /api/sections/{sectionId}/seat-map` - Get seat map
- `GET /api/sections/{sectionId}/seats/stats` - Get seat statistics

### 4. Events API
- `GET /api/events` - Get all events with filters
- `GET /api/events/{id}` - Get event by ID
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/category/{category}` - Get events by category
- `GET /api/events/featured` - Get featured events
- `GET /api/events/popular` - Get popular events

### 5. Ticket Categories API
- `GET /api/events/{eventId}/ticket-categories` - Get categories by event
- `GET /api/events/{eventId}/ticket-categories/active` - Get active categories by event
- `GET /api/events/{eventId}/ticket-categories/availability` - Get categories with availability
- `GET /api/ticket-categories/{id}` - Get category by ID
- `GET /api/ticket-categories/{id}/stats` - Get category statistics

### 6. Tickets API
- `GET /api/tickets/my-tickets` - Get user tickets
- `POST /api/tickets/purchase` - Purchase tickets
- `GET /api/tickets/validate/{qrCode}` - Validate ticket
- `PUT /api/tickets/{id}/use` - Use ticket
- `PUT /api/tickets/{id}/refund` - Refund ticket

### 7. Security API
- `GET /api/admin/validate-permission` - Validate admin permission
- `GET /api/rate-limit/check` - Check rate limit
- `POST /api/payment/validate-method` - Validate payment method

## Request/Response Examples

### Create Venue
```http
POST /api/venues
Content-Type: application/json

{
  "name": "Serena Hotel Kigali",
  "address": "KN 3 Ave, Kigali",
  "city": "Kigali",
  "country": "Rwanda",
  "capacity": 500,
  "description": "Luxury hotel with conference facilities"
}
```

### Purchase Tickets
```http
POST /api/tickets/purchase
Content-Type: application/json

{
  "category_id": "category-123",
  "quantity": 2,
  "holder_names": ["John Doe", "Jane Smith"],
  "payment_method": "mobile_money",
  "payment_details": {
    "phone_number": "+250123456789"
  }
}
```

## Error Handling
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": ["Field 'name' is required"],
  "status": 400
}
```

## Rate Limiting
- General endpoints: 100 requests/minute
- Authentication: 10 requests/minute
- Ticket purchase: 5 requests/minute
- Admin endpoints: 50 requests/minute

## Pagination
All list endpoints support pagination:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

## Security Features
- JWT authentication
- Input sanitization
- Rate limiting
- CSRF protection
- Audit logging
- Permission validation

## Support
- Email: api-support@agura-ticketing.com
- Documentation: https://docs.agura-ticketing.com
- Status: https://status.agura-ticketing.com
