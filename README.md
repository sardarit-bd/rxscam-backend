# Scam RX Project Backend

### 📖 Overview  
This repository powers the backend for the **Scam RX Project Backend System** platform — a complete ** Scam finder **.  

Built with **Node.js**, **Express**, and **MongoDB**, it provides APIs 

It supports user roles such as **Admin**, **Service Provider**, and **User**.
---

### 🧱 Tech Stack  
- **Node.js** — Server runtime  
- **Express.js** — Web framework  
- **MongoDB + Mongoose** — Database and ORM  
- **JWT** — Authentication & authorization  
- **dotenv** — Environment variable management  
- **Nodemailer** — Email service integration  

---




### Clone the repository and move the folder

```bash
git clone https://github.com/sardarit-bd/rxscam-backend.git
cd rxscam-backend
```







### ⚙️ Environment Variables  
Create a file named `.env.development` in the **project root directory** and add the following:

```bash
# Application Port
PORT=5000


# Database config here
MONGO_URI= Your MongoDB database Connection URL


# Environment Here
NODE_ENV=development

#jwt secret
JWT_SECRET=Your JWT Secret

#Client URL
CLIENT_URL= Your Frontend Application URL

#Cloudinary Config
CLOUDINARY_CLOUD_NAME= Your Cloudinary Account Cloud Name
CLOUDINARY_API_KEY= Your Cloudinary Account API Key
CLOUDINARY_API_SECRET=Your Cloudinary Account API Secret


#redis config
 REDIS_HOST=  Your Redis Host URL
 REDIS_PORT = Your Redis PORT
 REDIS_PASSWORD = Your Redis Password


# nodemailer configuration
EMAIL_USER = Your Application Email address
EMAIL_PASSWORD = Your email address app Password

```








### Install dependencies and start the server

```bash
npm install

# Start the server in development mode (using nodemon)
npm run dev

# Or start normally
npm start

```






### You will see"
Environment Variables Loaded:
MONGODB_URI: Your mongodb url



### And you can access 
http://localhost:5000




#  Thank you so Much
