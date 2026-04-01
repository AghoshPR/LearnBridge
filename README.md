# LearnBridge
📘 LearnBridge – Smart eLearning Platform

LearnBridge is a modern, full-stack eLearning platform designed to seamlessly connect students, teachers, and administrators within a unified digital learning ecosystem. It delivers a scalable, interactive, and production-ready solution for online education by combining structured course delivery, real-time communication, and intelligent assistance.

The platform enables students to explore courses, securely purchase them using integrated payment gateways (Razorpay and Stripe), and access high-quality video lessons. Students can participate in live classes with real-time chat, engage in a global Q&A community, and leverage an AI-powered chatbot for instant doubt resolution while learning. Personalized features such as wishlist management, coupon-based discounts, and wallet tracking enhance the overall user experience.

For teachers, LearnBridge provides a powerful dashboard to create and manage courses, upload lessons, schedule and conduct live sessions, and interact with students. Teachers can monitor enrollments, track performance, and manage their earnings through a dedicated wallet system with automated revenue sharing (80% teacher / 20% platform).

The admin panel ensures complete control over the platform, including user and teacher management (approval/rejection/blocking), course moderation, coupon and promotional campaign management, transaction monitoring, and financial operations such as transferring earnings to teachers.

LearnBridge incorporates advanced backend capabilities such as JWT-based authentication with HttpOnly cookies and Google OAuth, ensuring secure and scalable access control. WebSockets (Django Channels) enable real-time features like live chat and notifications, while Celery handles asynchronous background tasks such as email notifications and system processes.

From an infrastructure perspective, the platform is fully containerized using Docker and deployed with a production-ready setup using Nginx, AWS RDS (database), and AWS S3 (media storage). This ensures high availability, scalability, and performance under real-world usage.

Overall, LearnBridge is designed as a feature-rich, scalable, and industry-level Learning Management System (LMS) that combines modern web technologies, real-time interaction, and intelligent assistance to deliver an enhanced digital learning experience.

---

## Key Features

### For Students
* **Course Exploration & Purchase**: Browse an extensive catalog and securely purchase courses using integrated payment gateways (Razorpay and Stripe).
* **Interactive Learning**: Access high-quality video lessons, participate in live classes with real-time chat and video call, and engage in a global Q&A community.
* **AI-Powered Assistance**: Leverage an AI chatbot for instant doubt resolution during learning sessions.
* **Personalized Experience**: Manage wishlists, apply coupon-based discounts, and track transactions using a built-in wallet system.

### For Teachers
* **Course Management**: Create and manage courses, upload video lessons, and track overall student engagement.
* **Live Sessions**: Schedule and conduct live classes equipped with interactive real-time chat.
* **Financial Tracking**: Dedicated wallet system to track earnings with automated revenue sharing (80% teacher / 20% platform).
* **Student Interaction**: Seamlessly interact with students and answer queries.

### For Administrators
* **User & Teacher Management**: Approve, reject, or block users and teacher profiles to maintain platform integrity.
* **Content Moderation**: Moderate courses, review Q&A threads, and oversee operations.
* **Promotions & Campaign Management**: Generate and manage coupons or promotional campaigns.
* **Financial Oversight**: Monitor all transactions and oversee the transfer of earnings to teachers.

---

## ⚙️ Technology Stack

**Frontend**
* React.js & Redux Toolkit
* Tailwind CSS & ShadCN UI
* Axios

**Backend**
* Django & Django REST Framework (DRF)
* Python

**Authentication & Security**
* JWT (with HttpOnly cookies)
* Google OAuth Integration

**Database**
* MySQL

**Real-Time & Background Processes**
* WebSockets (Django Channels)
* Celery & Redis (Background task processing)

**Payments & Cloud**
* Razorpay & Stripe Integrations
* AWS RDS (Relational Database Service)
* AWS S3 (Media Storage)

**DevOps & Deployment**
* Docker & Docker Compose
* Nginx

---

## Implementation Overview

* **Security**: Role-based access control (Student / Teacher / Admin) backed by JWT HttpOnly cookies to prevent XSS attacks.
* **Real-time Engine**: Django Channels manages WebSocket connections for live chat and instant notifications.
* **Asynchronous Tasks**: Celery handles resource-intensive tasks such as sending email notifications and background processing to keep the main thread unblocked.
* **Cloud Infrastructure**: Scalable containerized deployment with Nginx functioning as a reverse proxy, data stored safely in AWS RDS, and multimedia assets directly served from AWS S3 buckets.

---

## 📁 Project Structure

```text
LearnBridge/
├── backend/
│   └── LearnBridge/
│       ├── adminapp/          # Admin dashboard APIs & controls
│       ├── authapp/           # Auth logic & Google OAuth
│       ├── studentapp/        # Student specific APIs
│       ├── teacherapp/        # Teacher interactions
│       ├── courses/           # Core course models, serializers, views
│       ├── liveclass/         # WebSocket & RTC logic for Live Classes
│       ├── chat/              # Real-time chat functionality
│       ├── qna/               # Q&A forums & discussions
│       ├── payments/          # Stripe/Razorpay integrations
│       ├── wallet/            # Virtual wallet & Revenue splits
│       ├── notifications/     # Real-time WebSocket notifications
│       ├── promotions/        # Coupons & discount logic
│       ├── ai_assistant/      # AI Chatbot logic
│       ├── manage.py          # Django entry point
│       ├── requirements.txt   # Python dependencies
│       ├── Dockerfile         
│       └── docker-compose.yml 
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable standard & ShadCN UI components
│   │   ├── Pages/             # React views for features and dashboards
│   │   ├── Services/          # Axios instance & API wrapper calls
│   │   ├── context/           # Global states
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── .env                   # Frontend Environment Variables
└── README.md
```

---

## Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+)
* [Python](https://www.python.org/) 3.10+
* [Docker](https://www.docker.com/) 

### 1. Environment Variables Configuration

**Frontend (`frontend/.env`)**:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_BASE_URL=http://localhost:8000/api
```

**Backend (`backend/LearnBridge/.env`)**:
*(Create this file if it doesn't exist)*
```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
STRIPE_SECRET_KEY=your_stripe_secret
RAZORPAY_KEY_ID=your_razorpay_key
```

### 2. Run Locally (Without Docker)

#### Backend Setup
```bash
# Navigate to the Django project base
cd backend/LearnBridge

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run the development server
python manage.py runserver
```
*API will run at: `http://localhost:8000/`*

#### Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install UI packages
npm install

# Start Vite server
npm run dev
```
*Platform will be accessible at: `http://localhost:5173/`*

### 3. Run with Docker

```bash
# Navigate to the backend application container
cd backend/LearnBridge

# Build and startup services
docker-compose up --build
```

---

## 🔗 API Overview

**Base URL**: `/api/`

| Route Prefix | Description |
|--------------|-------------|
| `/auth/` | Authentication (Login, Register, Refresh JWT, Google OAuth) |
| `/student/` | Student profile management & enrollments |
| `/teacher/` | Teacher dashboard, course creation & metrics |
| `/admin/` | Administrator controls (user approvals, moderation) |
| `/courses/` | Course catalog, video lessons, categories |
| `/wallet/` | Wallet transactions, withdrawals & revenue share |
| `/qna/` | Q&A community forum operations |
| *(Directly on `/api/`)* | Payments, Promotions, Live Classes, Real-time Chat, AI Assistant |

*(For thorough testing, you can use Postman, Thunder Client, or the DRF Browsable API interface.)*

---

## 👨‍💻 Author
**AGHOSH PR**