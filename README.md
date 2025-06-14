# InvoicePro - Professional Invoice Management System

InvoicePro is a modern, full-stack invoice management system built with React and Node.js. It provides a seamless experience for creating, managing, and tracking invoices with a beautiful, responsive UI and dark mode support.

![InvoicePro Screenshot](screenshot.png)

## Features

- 📝 Create and manage professional invoices
- 🎨 Modern, responsive UI with dark mode support
- 👥 Client management system
- 📊 Invoice status tracking (Pending, Paid, Overdue)
- 📧 Email invoice functionality
- 📄 PDF generation and download
- 🔒 Secure authentication system
- 🌙 Dark/Light theme toggle
- 📱 Mobile-responsive design

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- React Bootstrap for UI components
- Context API for state management
- React Toastify for notifications
- Custom hooks for form handling

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- PDF generation
- Email service integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/invoice-generator.git
cd invoice-generator
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# In backend directory
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

5. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from frontend directory)
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### Authentication
- Register a new account
- Login with your credentials
- Access protected routes

### Creating Invoices
1. Navigate to the Invoices page
2. Click "New Invoice"
3. Fill in client details
4. Add invoice items
5. Set tax rate and discounts
6. Save or send the invoice

### Managing Invoices
- View all invoices
- Filter by status
- Edit existing invoices
- Download as PDF
- Send via email
- Track payment status

## Features in Detail

### Dark Mode
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions
- Optimized for all components

### Invoice Management
- Create professional invoices
- Add multiple items
- Calculate totals automatically
- Apply tax rates and discounts
- Save as drafts
- Track payment status

### Client Management
- Store client information
- Quick client selection
- Contact details management
- Address information

### PDF Generation
- Professional PDF layout
- Company branding
- Itemized details
- Payment information
- Terms and conditions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email akinyifaith222@gmail.com or create an issue in the repository.

## Acknowledgments

- React Bootstrap for UI components
- React Router for navigation
- React Toastify for notifications
- All contributors who have helped shape this project

---

Built with ❤️ by Faith
