# MERN Stack E-Commerce App

This is a full-featured e-commerce application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).
It includes user and admin dashboards, JWT authentication, product management, order tracking, and Braintree payment integration.

## Live Demo

Frontend:   
Backend:

## Technologies Used

- Frontend: React, Tailwind CSS or Bootstrap
- Backend: Node.js, Express.js
- Database: MongoDB Atlas
- Authentication: JWT, bcrypt
- File Uploads: express-formidable
- Payment Integration: Braintree , paypal
- Deployment: Vercel

## Features

### User

- Register and login with JWT authentication
- View products by category
- Add products to cart and place orders
- Online payments using Braintree
- View past orders and details

### Admin

- Admin dashboard with authentication
- Create, update, and delete products
- Manage categories
- View and manage customer orders

## Project Structure

ecommerce/
├── client/ # React frontend
├── server/ # Express backend
├── .gitignore
├── README.md

Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Replace your-username and your-repo-name with your actual GitHub username and repository name.

3. Backend Setup
Navigate to the backend folder and install dependencies:
cd server
npm install
Create a .env or config.env file inside the server directory with these environment variables:
PORT=5000
MONGO_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
BRAINTREE_MERCHANT_ID=your-braintree-merchant-id
BRAINTREE_PUBLIC_KEY=your-braintree-public-key
BRAINTREE_PRIVATE_KEY=your-braintree-private-key
Replace placeholders with your actual credentials.

Start the backend server:
npm start
By default, the server will run on http://localhost:5000.

3. Frontend Setup
Open a new terminal window/tab, go to the frontend folder, and install dependencies:
cd ../client
npm install

Create a .env file inside the client folder with:
VITE_API_URL=http://localhost:5000/api/v1

Start the frontend development server:
npm run dev
By default, this will run on http://localhost:5173 (or the port Vite assigns).



