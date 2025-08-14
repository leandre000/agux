# AGURA Ticketing System - Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the AGURA Ticketing System API in your application. The system follows a hierarchical flow: Venues → Events → Sections → Seats → Ticket Categories → Tickets.

## Implementation Flow

### 1. Venue Management (Admin Only)

#### Step 1.1: Create Venue
```typescript
import { VenuesAPI } from '@/lib/api';

// Create a new venue
const venueData = {
  name: "Serena Hotel Kigali",
  address: "KN 3 Ave, Kigali",
  city: "Kigali",
  country: "Rwanda",
  capacity: 500,
  description: "Luxury hotel with conference facilities",
  amenities: ["parking", "wifi", "catering"],
  parking_available: true,
  wheelchair_accessible: true
};

try {
  const venue = await VenuesAPI.createVenue(venueData);
  console.log('Venue created:', venue.id);
} catch (error) {
  console.error('Failed to create venue:', error);
}
```

#### Step 1.2: Validate Venue Data
```typescript
import { VenuesAPI } from '@/lib/api';

const errors = VenuesAPI.validateVenueData(venueData);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  return;
}
```

### 2. Section Management (Admin Only)

#### Step 2.1: Create Section
```typescript
import { SectionsAPI } from '@/lib/api';

// Create VIP section
const vipSectionData = {
  name: "VIP Section",
  description: "Premium seating area with exclusive benefits",
  venue_id: venue.id,
  capacity: 100,
  seat_map_config: {
    rows: 10,
    columns: 10,
    row_labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    column_labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    blocked_seats: ["A1", "A2"], // Reserved for special guests
    special_seats: {
      "A3": {
        type: "wheelchair",
        description: "Wheelchair accessible seat"
      }
    }
  },
  color_code: "#FFD700" // Gold color for VIP
};

const vipSection = await SectionsAPI.createSection(vipSectionData);

// Create Regular section
const regularSectionData = {
  name: "Regular Section",
  description: "Standard seating area",
  venue_id: venue.id,
  capacity: 400,
  seat_map_config: {
    rows: 20,
    columns: 20,
    row_labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"],
    column_labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
    blocked_seats: [],
    special_seats: {}
  },
  color_code: "#4CAF50" // Green color for regular
};

const regularSection = await SectionsAPI.createSection(regularSectionData);
```

#### Step 2.2: Generate Seat Map Configuration
```typescript
import { SectionsAPI } from '@/lib/api';

// Generate seat map for VIP section
const vipSeatMap = SectionsAPI.generateSeatMapConfig(10, 10);

// Generate seat map for regular section
const regularSeatMap = SectionsAPI.generateSeatMapConfig(20, 20);
```

### 3. Seat Management (Admin Only)

#### Step 3.1: Create Seats in Bulk
```typescript
import { SeatsAPI } from '@/lib/api';

// Create VIP seats
const vipSeatsData = {
  section_id: vipSection.id,
  seat_map_config: vipSection.seat_map_config,
  seat_type: "vip",
  price_modifier: 50000 // Additional 50,000 RWF for VIP seats
};

const vipSeats = await SeatsAPI.createBulkSeats(vipSeatsData);

// Create regular seats
const regularSeatsData = {
  section_id: regularSection.id,
  seat_map_config: regularSection.seat_map_config,
  seat_type: "standard",
  price_modifier: 0
};

const regularSeats = await SeatsAPI.createBulkSeats(regularSeatsData);
```

#### Step 3.2: Validate Seat Data
```typescript
import { SeatsAPI } from '@/lib/api';

const errors = SeatsAPI.validateBulkSeatData(vipSeatsData);
if (errors.length > 0) {
  console.error('Seat validation errors:', errors);
  return;
}
```

### 4. Event Management (Admin Only)

#### Step 4.1: Create Event
```typescript
import { EventsAPI } from '@/lib/api';

const eventData = {
  title: "Summer Music Festival 2024",
  description: "A fantastic music festival featuring local and international artists",
  date: "2024-07-15",
  start_time: "18:00",
  end_time: "23:00",
  venue_id: venue.id,
  artist_lineup: ["Artist 1", "Artist 2", "Artist 3"],
  category: "music",
  max_tickets_per_user: 5
};

const event = await EventsAPI.createEvent(eventData);
```

#### Step 4.2: Publish Event
```typescript
import { EventsAPI } from '@/lib/api';

// Publish the event to make it visible to users
await EventsAPI.publishEvent(event.id);
```

### 5. Ticket Categories (Admin Only)

#### Step 5.1: Create Ticket Categories
```typescript
import { TicketCategoriesAPI } from '@/lib/api';

// Create VIP ticket category
const vipCategoryData = {
  name: "VIP Ticket",
  description: "Premium seating with exclusive benefits",
  price: 100000, // 100,000 RWF
  currency: "RWF",
  event_id: event.id,
  section_id: vipSection.id,
  max_quantity_per_user: 2,
  early_bird_discount: {
    percentage: 20,
    valid_until: "2024-06-15T23:59:59Z"
  }
};

const vipCategory = await TicketCategoriesAPI.createTicketCategory(vipCategoryData);

// Create regular ticket category
const regularCategoryData = {
  name: "Regular Ticket",
  description: "Standard seating",
  price: 50000, // 50,000 RWF
  currency: "RWF",
  event_id: event.id,
  section_id: regularSection.id,
  max_quantity_per_user: 5,
  early_bird_discount: {
    percentage: 15,
    valid_until: "2024-06-15T23:59:59Z"
  }
};

const regularCategory = await TicketCategoriesAPI.createTicketCategory(regularCategoryData);
```

#### Step 5.2: Activate Ticket Categories
```typescript
import { TicketCategoriesAPI } from '@/lib/api';

// Activate both categories
await TicketCategoriesAPI.activateTicketCategory(vipCategory.id);
await TicketCategoriesAPI.activateTicketCategory(regularCategory.id);
```

### 6. User Ticket Purchase Flow

#### Step 6.1: Get Available Ticket Categories
```typescript
import { TicketCategoriesAPI } from '@/lib/api';

// Get all active ticket categories for the event
const categories = await TicketCategoriesAPI.getActiveTicketCategoriesByEvent(event.id);

// Display categories to user
categories.forEach(category => {
  console.log(`${category.name}: ${category.price} ${category.currency}`);
  
  // Check if early bird discount is available
  if (TicketCategoriesAPI.isEarlyBirdDiscountValid(category)) {
    const discountedPrice = TicketCategoriesAPI.calculateDiscountedPrice(category);
    console.log(`Early bird price: ${discountedPrice} ${category.currency}`);
  }
});
```

#### Step 6.2: Check Seat Availability
```typescript
import { SeatsAPI } from '@/lib/api';

// Get seat availability for a section
const availability = await SeatsAPI.getSeatAvailability(vipSection.id, event.id);

console.log(`Available seats: ${availability.available_seats}/${availability.total_seats}`);

// Get available seats for a specific category
const availableSeats = await SeatsAPI.getAvailableSeatsForCategory(vipCategory.id);
```

#### Step 6.3: Purchase Tickets
```typescript
import { TicketsAPI } from '@/lib/api';
import { SecurityValidator } from '@/lib/api/security';

// Validate purchase before proceeding
const validation = await SecurityValidator.validateTicketPurchase(vipCategory.id, 2);
if (!validation.canPurchase) {
  console.error('Cannot purchase tickets:', validation.reason);
  return;
}

// Purchase tickets
const purchaseData = {
  category_id: vipCategory.id,
  quantity: 2,
  holder_names: ["John Doe", "Jane Smith"],
  payment_method: "mobile_money",
  payment_details: {
    phone_number: "+250123456789"
  }
};

try {
  const purchaseResult = await TicketsAPI.purchaseTickets(purchaseData);
  
  console.log('Purchase successful!');
  console.log(`Total amount: ${purchaseResult.total_amount} ${purchaseResult.currency}`);
  console.log(`Transaction ID: ${purchaseResult.transaction_id}`);
  
  // Display ticket information
  purchaseResult.tickets.forEach(ticket => {
    console.log(`Ticket: ${ticket.ticket_number} for ${ticket.holder_name}`);
  });
} catch (error) {
  console.error('Purchase failed:', error);
}
```

### 7. Admin Dashboard Implementation

#### Step 7.1: Get Dashboard Analytics
```typescript
import { AdminAPI } from '@/lib/api';

// Get comprehensive dashboard analytics
const analytics = await AdminAPI.getAdminDashboardAnalytics();

console.log('Revenue:', analytics.revenue_analytics.total_revenue);
console.log('Tickets sold:', analytics.ticket_analytics.total_tickets_sold);
console.log('Active events:', analytics.event_analytics.total_events);
```

#### Step 7.2: Manage Events
```typescript
import { AdminAPI } from '@/lib/api';

// Get all admin events
const adminEvents = await AdminAPI.getAdminEvents();

// Update event status
await AdminAPI.updateAdminEvent(event.id, {
  status: 'published',
  max_tickets_per_user: 3
});

// Cancel event if needed
await AdminAPI.updateAdminEvent(event.id, {
  status: 'cancelled'
});
```

### 8. Security Implementation

#### Step 8.1: Input Sanitization
```typescript
import { InputSanitizer } from '@/lib/api/security';

// Sanitize user input before API calls
const sanitizedData = InputSanitizer.sanitizeObject({
  name: "John Doe",
  email: "john@example.com",
  phone: "+250123456789"
});
```

#### Step 8.2: Permission Validation
```typescript
import { SecurityValidator } from '@/lib/api/security';

// Check if user has admin permissions
const hasPermission = await SecurityValidator.validateAdminPermission('manage_venues');
if (!hasPermission) {
  console.error('Insufficient permissions');
  return;
}

// Validate resource ownership
const isOwner = await SecurityValidator.validateResourceOwnership('venue', venueId);
if (!isOwner) {
  console.error('Not authorized to access this resource');
  return;
}
```

#### Step 8.3: Rate Limiting
```typescript
import { SecurityValidator } from '@/lib/api/security';

// Check rate limit before making requests
const rateLimit = await SecurityValidator.checkRateLimit('POST:/api/tickets/purchase');
if (!rateLimit.allowed) {
  console.error('Rate limit exceeded. Try again later.');
  return;
}
```

### 9. Error Handling Best Practices

#### Step 9.1: Comprehensive Error Handling
```typescript
import { VenuesAPI, EventsAPI, TicketsAPI } from '@/lib/api';

async function createEventWithVenue() {
  try {
    // Create venue
    const venue = await VenuesAPI.createVenue(venueData);
    
    // Create event
    const event = await EventsAPI.createEvent({
      ...eventData,
      venue_id: venue.id
    });
    
    // Create sections
    const sections = await Promise.all([
      SectionsAPI.createSection({ ...vipSectionData, venue_id: venue.id }),
      SectionsAPI.createSection({ ...regularSectionData, venue_id: venue.id })
    ]);
    
    console.log('Event setup completed successfully');
    return { venue, event, sections };
    
  } catch (error) {
    if (error.status === 400) {
      console.error('Validation error:', error.errors);
    } else if (error.status === 401) {
      console.error('Authentication required');
    } else if (error.status === 403) {
      console.error('Insufficient permissions');
    } else if (error.status === 429) {
      console.error('Rate limit exceeded');
    } else {
      console.error('Unexpected error:', error.message);
    }
    
    // Cleanup on failure
    await cleanupOnFailure();
    throw error;
  }
}

async function cleanupOnFailure() {
  // Implement cleanup logic for failed operations
  console.log('Cleaning up failed operation...');
}
```

#### Step 9.2: Retry Logic
```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (error.status === 429) {
        // Rate limit - wait longer
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      } else if (error.status >= 500) {
        // Server error - retry
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } else {
        // Client error - don't retry
        throw error;
      }
    }
  }
  
  throw lastError;
}

// Usage
const result = await retryOperation(() => TicketsAPI.purchaseTickets(purchaseData));
```

### 10. Production Deployment Checklist

#### Step 10.1: Security Checklist
- [ ] Enable HTTPS for all API calls
- [ ] Implement proper JWT token management
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable input sanitization
- [ ] Set up audit logging
- [ ] Implement CSRF protection

#### Step 10.2: Performance Checklist
- [ ] Implement caching for frequently accessed data
- [ ] Use pagination for large datasets
- [ ] Optimize database queries
- [ ] Set up monitoring and alerting
- [ ] Configure load balancing

#### Step 10.3: Testing Checklist
- [ ] Unit tests for all API functions
- [ ] Integration tests for complete flows
- [ ] Security tests for authentication and authorization
- [ ] Performance tests for high load scenarios
- [ ] End-to-end tests for user journeys

### 11. Monitoring and Analytics

#### Step 11.1: Track API Usage
```typescript
import { AuditLogger } from '@/lib/api/security';

// Log important user actions
await AuditLogger.logUserAction('ticket_purchased', 'ticket', ticketId, {
  amount: purchaseAmount,
  category: categoryName
});

// Log admin actions
await AuditLogger.logAdminAction('venue_created', 'venue', venueId, {
  capacity: venueCapacity,
  location: venueLocation
});
```

#### Step 11.2: System Health Monitoring
```typescript
import { AdminAPI } from '@/lib/api';

// Check system health
const health = await AdminAPI.getSystemHealth();
if (health.status === 'critical') {
  console.error('System health critical:', health);
  // Send alert to administrators
}
```

## Conclusion

This implementation guide provides a comprehensive approach to integrating the AGURA Ticketing System API. Follow the hierarchical flow and implement proper error handling, security measures, and monitoring for a robust production system.

For additional support and questions, refer to the API documentation or contact the development team.
