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
- `POST /api/venues` - Create venue (Admin only)
- `PUT /api/venues/{id}` - Update venue (Admin only)
- `DELETE /api/venues/{id}` - Delete venue (Admin only)

### 2. Sections API
- `GET /api/venues/{venueId}/sections` - Get sections by venue
- `GET /api/sections/{id}` - Get section by ID
- `POST /api/sections` - Create section (Admin only)
- `PUT /api/sections/{id}` - Update section (Admin only)
- `DELETE /api/sections/{id}` - Delete section (Admin only)

### 3. Seats API
- `GET /api/sections/{sectionId}/seats` - Get seats by section
- `GET /api/sections/{sectionId}/seats/availability` - Get seat availability
- `POST /api/sections/{sectionId}/seats/bulk` - Create bulk seats (Admin only)
- `POST /api/seats/validate-selection` - Validate seat selection

### 4. Events API
- `GET /api/events` - Get all events with filters
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/{id}` - Update event (Admin only)
- `PATCH /api/events/{id}/publish` - Publish event (Admin only)
- `PATCH /api/events/{id}/cancel` - Cancel event (Admin only)

### 5. Ticket Categories API
- `GET /api/events/{eventId}/ticket-categories` - Get categories by event
- `POST /api/ticket-categories` - Create category (Admin only)
- `PUT /api/ticket-categories/{id}` - Update category (Admin only)
- `PATCH /api/ticket-categories/{id}/activate` - Activate category (Admin only)

### 6. Tickets API
- `GET /api/tickets/my-tickets` - Get user tickets
- `POST /api/tickets/purchase` - Purchase tickets
- `GET /api/tickets/validate/{qrCode}` - Validate ticket
- `PUT /api/tickets/{id}/use` - Use ticket
- `PUT /api/tickets/{id}/refund` - Refund ticket

### 7. Admin API
- `GET /api/admin/analytics/dashboard` - Get dashboard analytics
- `GET /api/admin/venues` - Get admin venues
- `GET /api/admin/events` - Get admin events
- `GET /api/admin/tickets` - Get admin tickets

### 8. Security API
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
