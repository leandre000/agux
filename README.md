# AGURA Ticketing Mobile App

## 🚀 Version 1.0.0 - Production Ready

A comprehensive mobile ticketing application for events, venues, and ticket management across Africa. Built with React Native, Expo, and TypeScript.

## 🚀 Production Deployment

This app is configured for production use with the backend hosted on:
**https://agura-ticketing-backend.onrender.com**

## 📱 Features

- **Event Management**: Browse, search, and discover events
- **Venue Information**: Detailed venue details with amenities and accessibility
- **Ticket Purchasing**: Seamless ticket buying with seat selection
- **Payment Integration**: Support for mobile money, cards, and bank transfers
- **User Authentication**: Secure login with email, phone, and Google OAuth
- **Mobile Optimized**: Touch-friendly interface designed for mobile devices
- **Cross-Platform**: iOS and Android support
- **Profile Management**: Complete user profile and settings
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

## 📊 API Integration Status

### ✅ Completed APIs
- **Events API**: Browse, search, and event details
- **Venues API**: Venue information and nearby venues
- **Sections API**: Section management and seat maps
- **Seats API**: Seat selection and availability
- **Ticket Categories API**: Pricing and category management
- **Tickets API**: Purchase, validation, and management
- **Authentication API**: Login, registration, and OAuth

### 🔧 Mobile-Specific Features
- Mobile-optimized API endpoints
- Touch-friendly seat selection
- Offline error handling
- Performance optimization
- Responsive design

### 📋 Key API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/phone/verify` - Phone verification

#### Events (Mobile-Optimized)
- `GET /api/events?mobile_optimized=true` - Get all events
- `GET /api/events/{id}/mobile` - Get event details
- `GET /api/events/nearby` - Find nearby events
- `GET /api/events/search/mobile` - Search events

#### Tickets (Mobile-Optimized)
- `POST /api/tickets/purchase/mobile` - Purchase tickets
- `GET /api/tickets/upcoming/mobile` - Get upcoming tickets
- `GET /api/tickets/{id}/qr-code/mobile` - Get QR code
- `POST /api/tickets/validate/entry` - Validate ticket entry

## 🎯 User Journey

1. **User Registration/Login**
   - Email/phone registration
   - Google OAuth integration
   - Phone verification

2. **Event Discovery**
   - Browse upcoming events
   - Search by category/location
   - Find nearby events

3. **Ticket Purchase**
   - Select event and category
   - Choose seats (if applicable)
   - Payment processing
   - Ticket generation

4. **Ticket Management**
   - View purchased tickets
   - QR code display
   - Download options
   - Refund/cancellation

## 🚀 Deployment Status

✅ **Production Ready**
- Backend integration complete
- Error handling implemented
- Security measures in place
- Performance optimized
- User experience polished
- Mobile-specific APIs implemented
- Cross-platform support verified

## 📚 Documentation

- [API Integration Guide](./MOBILE_API_INTEGRATION.md)
- [Production Readiness](./PRODUCTION_READINESS.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Getting Started](./GETTING_STARTED.txt)

## 📞 Support

For support and questions:
- Email: support@agura.com
- Phone: +250 788 123 456
- Documentation: Available in the app under Help & Support

---

## 🎉 Production Ready!

The AGURA Ticketing Mobile App is now production-ready with:
- ✅ Complete API integration
- ✅ Mobile-optimized user experience
- ✅ Secure authentication and payment
- ✅ Comprehensive error handling
- ✅ Performance optimization
- ✅ Cross-platform support

**Ready for production deployment and user release!**

---

*Built with ❤️ for the African continent*

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
