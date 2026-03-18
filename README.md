# LearnBridge
📘 LearnBridge – Smart eLearning Platform

LearnBridge is a modern, full-stack eLearning platform designed to seamlessly connect students, teachers, and administrators within a unified digital learning ecosystem. It delivers a scalable, interactive, and production-ready solution for online education by combining structured course delivery, real-time communication, and intelligent assistance.

The platform enables students to explore courses, securely purchase them using integrated payment gateways (Razorpay and Stripe), and access high-quality video lessons. Students can participate in live classes with real-time chat, engage in a global Q&A community, and leverage an AI-powered chatbot for instant doubt resolution while learning. Personalized features such as wishlist management, coupon-based discounts, and wallet tracking enhance the overall user experience.

For teachers, LearnBridge provides a powerful dashboard to create and manage courses, upload lessons, schedule and conduct live sessions, and interact with students. Teachers can monitor enrollments, track performance, and manage their earnings through a dedicated wallet system with automated revenue sharing (80% teacher / 20% platform).

The admin panel ensures complete control over the platform, including user and teacher management (approval/rejection/blocking), course moderation, coupon and promotional campaign management, transaction monitoring, and financial operations such as transferring earnings to teachers.

LearnBridge incorporates advanced backend capabilities such as JWT-based authentication with HttpOnly cookies and Google OAuth, ensuring secure and scalable access control. WebSockets (Django Channels) enable real-time features like live chat and notifications, while Celery handles asynchronous background tasks such as email notifications and system processes.

From an infrastructure perspective, the platform is fully containerized using Docker and deployed with a production-ready setup using Nginx, AWS RDS (database), and AWS S3 (media storage). This ensures high availability, scalability, and performance under real-world usage.

Overall, LearnBridge is designed as a feature-rich, scalable, and industry-level Learning Management System (LMS) that combines modern web technologies, real-time interaction, and intelligent assistance to deliver an enhanced digital learning experience.


## ⚙️ Tech Stack

Frontend / Libraries      - React.js, Redux Toolkit, Axios, Tailwind CSS, ShadCN UI  
Backend / Framework       - Django, Django REST Framework, Python  
Authentication            - JWT (HttpOnly Cookies), Google OAuth  
Database                  - MySQL  
Real-Time / Async         - WebSockets (Django Channels), Celery  
Payments                  - Razorpay, Stripe  
Cloud / Storage           - AWS RDS, AWS S3  
DevOps / Deployment       - Docker, Nginx  
