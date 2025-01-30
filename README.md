
# Order Management System

## Project Overview
The Order Management System is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to efficiently manage customer orders. It allows users to add, view, update, and delete orders.


### Key Features

- **Add a New Order**: Implement a form to create and save new orders.
- **View All Orders**: Display a list of all orders in a user-friendly tabular format.
- **Update an Order**: Provide an option to edit and update the details of an existing order.
- **Delete an Order**: Allow users to remove an order from the system.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Others**: Mongoose
##  Setup Instructions
### 1. Clone the Repository
To get started, clone the repository to your local machine:
```bash
git clone https://github.com/binaduwal/OrderManagementSystem.git
```
### 2. Install Dependency

#### Backend:
Navigate to the backend directory:
```bash
cd backend
```

Install the backend dependencies:
```bash
npm install
```

Frontend:
Navigate to the frontend directory:
```bash
cd frontend
```

Install the frontend dependencies:
```bash
npm install
```
## Set Up Environment Variables
In the backend directory, create a .env file and add the following variables:
```.env
MONGO_URI=your_mongodb_connection_string
PORT=your_desired_port
```
## Running the Project
### Development Mode
#### Backend:
Run the backend server in development mode using nodemon:
```bash
cd backend
npm run dev
```

#### Frontend:
Run the React frontend application:
```bash
cd frontend
npm run dev
```

## API Routes
- **POST** `/orders`: Create a new order.
- **GET** `/orders`: Retrieve all orders.
- **PATCH** `/Update/:id`: Update an existing order.
- **DELETE** `/orders/delete:id`: Delete an order.

## Production Build
To build and run the production version:

Build the Frontend:
```bash
cd frontend
npm run build
```

Start the Backend:
```bash
cd backend
npm start
````



## Deployment
- **Frontend** is deployed on [Vercel](https://order-management-system-blush.vercel.app/orders).
- **Backend** is deployed on [Render](https://ordermanagementsystem.onrender.com).

