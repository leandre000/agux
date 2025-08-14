# AGURA Ticketing System - Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the AGURA Ticketing System API in your application. The system follows a hierarchical flow: Venues → Events → Sections → Seats → Ticket Categories → Tickets.

## Implementation Flow

### 1. Venue Management

#### Step 1.1: Browse Venues
```typescript
import { VenuesAPI } from '@/lib/api';

// Get all venues
const venues = await VenuesAPI.getVenues();

// Get venues by city
const kigaliVenues = await VenuesAPI.getVenuesByCity('Kigali');

// Get venues by country
const rwandaVenues = await VenuesAPI.getVenuesByCountry('Rwanda');

// Search venues
const searchResults = await VenuesAPI.searchVenues('hotel');

// Get popular venues
const popularVenues = await VenuesAPI.getPopularVenues(10);
```

#### Step 1.2: Get Venue Details
```typescript
import { VenuesAPI } from '@/lib/api';

// Get specific venue
const venue = await VenuesAPI.getVenueById('venue-123');

// Get venues near location
const nearbyVenues = await VenuesAPI.getVenuesNearLocation(-1.9441, 30.0619, 10); // Kigali coordinates
```

### 2. Section Management

#### Step 2.1: Browse Sections
```typescript
import { SectionsAPI } from '@/lib/api';

// Get sections by venue
const sections = await SectionsAPI.getSectionsByVenue('venue-123');

// Get sections with availability
const sectionsWithAvailability = await SectionsAPI.getSectionsByVenueWithAvailability('venue-123', 'event-456');

// Get premium sections
const premiumSections = await SectionsAPI.getPremiumSections('venue-123');

// Get accessible sections
const accessibleSections = await SectionsAPI.getAccessibleSections('venue-123');
```

#### Step 2.2: Get Section Details
```typescript
import { SectionsAPI } from '@/lib/api';

// Get specific section
const section = await SectionsAPI.getSectionById('section-123');

// Get section seat map
const seatMap = await SectionsAPI.getSectionSeatMap('section-123');

// Get section statistics
const stats = await SectionsAPI.getSectionStats('section-123', 'event-456');

// Get section pricing
const pricing = await SectionsAPI.getSectionPricing('section-123');
```

### 3. Seat Management

#### Step 3.1: Browse Seats
```typescript
import { SeatsAPI } from '@/lib/api';

// Get seats by section
const seats = await SeatsAPI.getSeatsBySection('section-123');

// Get seat availability
const availability = await SeatsAPI.getSeatAvailability('section-123', 'event-456');

// Get available seats
const availableSeats = await SeatsAPI.getAvailableSeatsForSection('section-123', 'event-456');

// Get occupied seats
const occupiedSeats = await SeatsAPI.getOccupiedSeatsForSection('section-123', 'event-456');
```

#### Step 3.2: Get Seat Details
```typescript
import { SeatsAPI } from '@/lib/api';

// Get specific seat
const seat = await SeatsAPI.getSeatById('seat-123');

// Get seat map
const seatMap = await SeatsAPI.getSeatMap('section-123');

// Get seat statistics
const stats = await SeatsAPI.getSeatStats('section-123');

// Get special seats
const specialSeats = await SeatsAPI.getSpecialSeats('section-123', 'wheelchair');
```

### 4. Event Management

#### Step 4.1: Get Available Events
```typescript
import { EventsAPI } from '@/lib/api';

// Get all events
const events = await EventsAPI.getEvents();

// Get upcoming events
const upcomingEvents = await EventsAPI.getUpcomingEvents();

// Get events by category
const musicEvents = await EventsAPI.getEventsByCategory('music');

// Get events by venue
const venueEvents = await EventsAPI.getEventsByVenue(venue.id);
```

### 5. Ticket Categories

#### Step 5.1: Browse Ticket Categories
```typescript
import { TicketCategoriesAPI } from '@/lib/api';

// Get ticket categories by event
const categories = await TicketCategoriesAPI.getTicketCategoriesByEvent('event-123');

// Get active ticket categories
const activeCategories = await TicketCategoriesAPI.getActiveTicketCategoriesByEvent('event-123');

// Get categories with availability
const categoriesWithAvailability = await TicketCategoriesAPI.getTicketCategoriesWithAvailability('event-123');

// Get specific category
const category = await TicketCategoriesAPI.getTicketCategoryById('category-123');
```

#### Step 5.2: Get Category Details
```typescript
import { TicketCategoriesAPI } from '@/lib/api';

// Get category statistics
const stats = await TicketCategoriesAPI.getTicketCategoryStats('category-123');

// Check early bird discount
if (TicketCategoriesAPI.isEarlyBirdDiscountValid(category)) {
  const discountedPrice = TicketCategoriesAPI.calculateDiscountedPrice(category);
  console.log(`Early bird price: ${discountedPrice} ${category.currency}`);
}
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

#### Step 6.2: Check Ticket Availability
```typescript
import { TicketCategoriesAPI } from '@/lib/api';

// Get ticket categories with availability
const categories = await TicketCategoriesAPI.getTicketCategoriesWithAvailability(event.id);

categories.forEach(category => {
  console.log(`${category.name}: ${category.available_quantity} available`);
});
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
