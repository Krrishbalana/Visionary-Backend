# 🎥 Visionary Backend

## 📜 Description
The **Visionary Backend** is the server-side component of a video hosting and sharing platform, designed to provide a seamless experience for users to upload, manage, and share videos.

## 🚀 Features
- **User Authentication**: Secure user authentication using JWT.
- **Password Security**: Secure password hashing with bcrypt.
- **Video Upload APIs**: Robust APIs for uploading and managing videos.
- **Playlist Management**: Create and manage playlists for users.
- **Modular Architecture**: Organized routes and controllers for maintainability.

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT**
- **Bcrypt**

## 📁 Project Folder Structure
```
/visionary-backend
│
├── models
├── routes
├── controllers
├── middleware
├── utils
└── server.js
```

## ⚙️ Setup Instructions
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/visionary-backend.git
    ```
2. Navigate to the project directory:
    ```bash
    cd visionary-backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Create a `.env` file in the root directory with the following variables:
    ```
    PORT=your_port
    MONGO_URI=your_mongo_uri
    JWT_SECRET=your_jwt_secret
    REFRESH_SECRET=your_refresh_secret
    ```
5. Run the application:
    ```bash
    npm start
    ```

## 📊 API Endpoints
| Endpoint               | Method | Description                     |
|-----------------------|--------|---------------------------------|
| `/api/auth`           | POST   | User authentication             |
| `/api/videos`         | POST   | Upload a new video             |
| `/api/playlists`      | POST   | Create a new playlist           |

## 👤 Author
**Krish Balana**  
[Portfolio](#) | [LinkedIn](#) | [GitHub](#)
