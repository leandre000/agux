# Agura - Event Ticketing App

A modern, production-ready mobile application for event ticketing built with React Native and Expo.

## 🚀 Production Deployment

This app is configured for production use with the backend hosted on:
**https://agura-ticketing-backend.onrender.com**

## 📱 Features

- **User Authentication**: Secure login/register with email and phone
- **Event Discovery**: Browse and search events
- **Ticket Booking**: Purchase tickets with multiple payment methods
- **Profile Management**: Complete user profile and settings
- **Payment Integration**: Support for cards and mobile money
- **Real-time Updates**: Live event updates and notifications

## 🛠 Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Node.js/Express (hosted on Render.com)
- **State Management**: Zustand
- **Navigation**: Expo Router
- **UI Components**: Custom components with Lucide icons
- **API**: RESTful API with JWT authentication

## 🔧 Production Configuration

The app is configured for production with:
- Production API endpoint: `https://agura-ticketing-backend.onrender.com`
- Increased timeout (30s) for cloud hosting
- Enhanced error handling for production scenarios
- Security headers and token management
- Bundle identifiers for iOS/Android

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agura
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   # iOS
   npx expo build:ios
   
   # Android
   npx expo build:android
   ```

## 🌐 Environment Variables

The app uses the following environment variables:
- `EXPO_PUBLIC_API_URL`: Backend API URL (defaults to production)

## 🔒 Security Features

- JWT token authentication
- Secure password requirements
- Token refresh mechanism
- Session timeout handling
- Input validation and sanitization

## 📊 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/password-reset/request` - Password reset request
- `POST /api/password-reset/reset` - Password reset

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/ticket-categories/event/:id` - Get event ticket categories

### Tickets
- `POST /api/tickets/purchase` - Purchase tickets
- `GET /api/tickets/my-tickets` - Get user tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id/use` - Mark ticket as used
- `PUT /api/tickets/:id/refund` - Refund ticket

## 🚀 Deployment Status

✅ **Production Ready**
- Backend integration complete
- Error handling implemented
- Security measures in place
- Performance optimized
- User experience polished

## 📞 Support

For support and questions:
- Email: support@agura.com
- Phone: +250 788 123 456
- Documentation: Available in the app under Help & Support

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
