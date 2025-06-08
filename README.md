# LiveHammer 🎥🔨

**LiveHammer** is a real-time video conferencing auction platform built using React, Node.js, Express, MongoDB, Socket.IO, and Agora. It enables auctioneers to live stream their events while allowing participants to place bids in real time through an interactive chat interface.

---

## 🚀 Features

- 📹 **Live Video Streaming** with Agora
- 💬 **Real-Time Bidding System** using Socket.IO
- ⏱ **Synchronized Auction Timer** for all participants
- 👤 **User Authentication and Roles** (Sellers, Bidders)
- 📊 **Bid Tracking** and winner declaration
- 🗃️ **MongoDB Database** for auctions, bids, users
- 📱 **Responsive UI** built with React

---

## 🛠 Tech Stack

| Layer           | Technology                            |
|----------------|----------------------------------------|
| Frontend        | React, Tailwind CSS, Agora SDK        |
| Backend         | Node.js, Express, Socket.IO           |
| Database        | MongoDB with Mongoose                 |
| Authentication  | JWT (JSON Web Tokens)                 |

---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Agora Account (for App ID and Certificate)

### Steps

```bash
# Clone the repository
git clone https://github.com/BKAPADIA04/LiveHammer.git
cd LiveHammer

# Install backend dependencies
cd backend
npm install

# Move to frontend
cd frontend
npm install

### 🧾 Environment Variables

Create the required `.env` files using the following bash command from the root of the project:

```bash
# Create .env for backend and client/.env for frontend
echo -e "PORT=5000\nMONGO_URI=your_mongodb_connection_string\nJWT_SECRET=your_secret_key\nAGORA_APP_ID=your_agora_app_id\nAGORA_APP_CERTIFICATE=your_agora_app_certificate" > .env && \
mkdir -p client && \
echo -e "REACT_APP_AGORA_APP_ID=your_agora_app_id" > client/.env

## 🧪 Running the App Locally

Run both backend and frontend with the following commands (in separate terminals or using a tool like concurrently):

```bash
# Start backend
npm run dev

# In a new terminal, start frontend
cd client
npm start
## 🎮 Usage

- Register and log in as a seller or bidder.
- Sellers can create new auctions with start price and timer.
- Start the live video stream.
- Bidders join the auction room and start bidding live.
- The highest bidder at the end wins and is notified in real-time.

---

## 🧪 Testing

- **Backend:** Use `npm test` (Jest or Mocha)
- **Frontend:** Run `npm test` inside `/client`

---

## 🛰 Deployment

- Backend can be deployed to Heroku, Render, or any Node.js-compatible host.
- Frontend can be deployed to Netlify, Vercel, or GitHub Pages.

To build the frontend for production:

```bash
cd client
npm run build
```

📌 Roadmap
Add integrated payment system

Record and replay auction videos

Email/SMS notifications for bidders

Admin dashboard for analytics

Better mobile optimizations


## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## 👤 Author

**Bhavya Kapadia**  
GitHub: [@BKAPADIA04](https://github.com/BKAPADIA04)

---

## 🌟 Acknowledgements

- [Agora](https://www.agora.io/) for video streaming  
- [Socket.IO](https://socket.io/) for real-time communication  
- [MongoDB](https://www.mongodb.com/) for database  
- [React](https://reactjs.org/) for frontend framework


