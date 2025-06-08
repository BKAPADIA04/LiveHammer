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
npm install

# Move to frontend
cd client
npm install
