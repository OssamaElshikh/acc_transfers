# Account Transfer Web App

This is a simple web application built with Django as the backend and React as the frontend. The app allows users to handle fund transfers between two accounts, import a list of accounts with opening balances, query account information, and transfer funds between accounts.

## Features

- Import accounts from CSV files.
- List all accounts.
- Get account information.
- Transfer funds between two accounts.
- Search accounts by name.
- Hide and show account information.
- Delete all imported accounts.

## Technologies Used

- Backend: Django, Django REST Framework
- Frontend: React, Bootstrap
- Database: PostgreSQL

## Setup and Installation

### Prerequisites

- Python 3.x
- Node.js and npm
- PostgreSQL

### Installation and Running the App


# Clone the repository
git clone https://github.com/OssamaElshikh/account_transfers.git
cd account_transfers

# Create and activate a virtual environment for the backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install backend dependencies
pip install -r backend/requirements.txt

# Create a .env file in the backend directory and add the following environment variables
cat <<EOT >> backend/.env
DEBUG=1
SECRET_KEY=your_secret_key
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
DATABASE_URL=postgres://your_db_user:your_db_password@localhost:5432/your_db_name
EOT

# Apply database migrations
python backend/manage.py migrate

# Create a superuser to access the Django admin
python backend/manage.py createsuperuser

# Start the backend server
python backend/manage.py runserver

# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the frontend development server
npm start
# acc_transfers
