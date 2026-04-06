# VCET ERP Backend

This is the Node.js/Express backend for the VCET College ERP portal. It connects to a MySQL database (hosted on Aiven) and provides authentication and assessment data for the frontend.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Database (Local or Cloud like Aiven)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials.
4. Run the database setup script to initialize tables:
   ```bash
   node setupDB.js
   ```

### Running the server
- Development: `npm run dev`
- Production: `npm start`

## 🛠️ Tech Stack
- **Express**: Node.js web application framework.
- **MySQL2**: MySQL client for Node.js.
- **Bcrypt**: Library for hashing passwords.
- **Dotenv**: Module to load environment variables.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing.

## 📁 Project Structure
- `server.js`: Main entry point and API routes.
- `setupDB.js`: Script to initialize the database and tables.
- `.env.example`: Template for environment variables.
