# AgroTrack - Agricultural Equipment Rental Platform

AgroTrack is a comprehensive web application that connects farmers with agricultural equipment owners, enabling easy rental and management of farming equipment.

## Features

- **Equipment Marketplace** - Browse and search available agricultural equipment
- **Booking System** - Reserve equipment for specific dates
- **Payment Integration** - Secure payment processing
- **User Management** - Farmer and equipment owner profiles
- **Admin Dashboard** - Manage users, equipment, and bookings
- **Notifications** - Real-time updates on bookings and rentals
- **Reviews & Ratings** - Community feedback on equipment and owners
- **Wishlist** - Save favorite equipment for later
- **Damage Reports** - Track and manage equipment damage claims

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose ODM
- JWT Authentication
- Passport.js (Google OAuth)

### Database
- MongoDB Atlas (Cloud)

## Project Structure

```
agrotrack-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── hooks/         # Custom hooks
│   └── package.json
│
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/AgroTrack?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-url.com
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.production` file:
```env
VITE_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Equipment
- `GET /api/equipment` - Get all available equipment
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Create new equipment (owner only)
- `PUT /api/equipment/:id` - Update equipment (admin/owner)
- `DELETE /api/equipment/:id` - Delete equipment (admin)

### Bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/user/:userId` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment details
- `PUT /api/payments/:id` - Update payment status

### Reviews
- `GET /api/reviews/equipment/:id` - Get equipment reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/equipment` - Get all equipment
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/analytics` - Get analytics data

## Database Models

### User
- name, email, password, role, mobile_number
- Roles: farmer, equipment_owner, admin

### Equipment
- name, category, price_per_day, location, description
- image_url, owner_id, availability_status

### Booking
- user_id, equipment_id, start_date, end_date
- total_cost, status, payment_status

### Payment
- payment_id, user_id, booking_id, total_amount
- payment_method, payment_status, transaction_id

### Review
- user_id, equipment_id, booking_id, rating, comment

### Notification
- user_id, message, type, is_read

### Wishlist
- user_id, equipment_id

### DamageReport
- booking_id, equipment_id, user_id, report_type
- description, severity, images_url, status

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. Users can:
- Register with email and password
- Login with credentials
- Login with Google OAuth
- Reset password via email OTP

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5001)

### Optional
- `EMAIL_USER` - Email for sending notifications
- `EMAIL_PASS` - Email app password
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL
- `FRONTEND_URL` - Frontend URL for CORS

## Running the Application

### Development Mode

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Production Mode

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run build
npm run preview
```

## Database Migration

If migrating from MySQL to MongoDB:

1. Ensure both databases are accessible
2. Update `.env` with MongoDB URI and MySQL credentials
3. Run migration script:
```bash
node migrate_mysql_to_mongodb.js
```

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB Atlas credentials
- Add your IP to MongoDB Atlas IP whitelist
- Check connection string format

### API Not Responding
- Ensure backend server is running on port 5001
- Check CORS settings in Express
- Verify environment variables are set

### Frontend Not Loading Data
- Check browser console for errors
- Verify API endpoint URLs
- Check network tab in browser DevTools

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@agrotrack.com or open an issue in the repository.

## Deployment

### Backend (Render/Heroku)
1. Push code to GitHub
2. Connect repository to Render/Heroku
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build settings
4. Deploy

## Future Enhancements

- Mobile app (React Native)
- Real-time chat between users
- Advanced analytics dashboard
- Equipment maintenance tracking
- Insurance integration
- GPS tracking for equipment
- Multi-language support

---

**Last Updated**: May 29, 2026
**Version**: 1.0.0
