Here’s a polished `README.md` file for your **Medicine Shop Website Backend** project, including setup instructions and live server/client links:

---

# 💊 Medicine Shop - Backend

This is the backend server for the **Medicine Shop** web application. It is built using **Express.js**, **TypeScript**, **Mongoose**, and deployed with **Vercel**. It handles all API endpoints and manages data communication between the frontend and MongoDB database.

---

## 🔗 Live Links

- 🌐 Client: [https://medicine-shop-client.vercel.app](https://medicine-shop-client.vercel.app)
- 🌐 Server: [https://medicine-shop-server-mu.vercel.app](https://medicine-shop-server-mu.vercel.app)

---

## ⚙️ Project Setup

### Initialize Project

```bash
npm init -y
npm install express mongoose cors dotenv
npm install -D typescript @types/cors
npm install -D typescript@next
tsc --init
```

### ESLint Configuration

```bash
npm i -D eslint@9.14.0 @eslint/js @types/eslint__js typescript typescript-eslint
npx eslint --init
```

> If version mismatch happens:
```bash
npm remove eslint
npm i -D eslint@9.14.0
```

### Prettier Configuration

```bash
npm i -D --exact prettier
```

Create a `.prettierrc` file:

```json
{
  "semi": true,
  "singleQuote": true
}
```

Create a `.prettierignore` file:

```
dist
coverage
```

Update `package.json` with Prettier script:

```json
"scripts": {
  "format": "prettier . --write"
}
```

---

## 🚀 Deployment (Vercel)

### Vercel Configuration

Install Vercel CLI if you haven't:

```bash
npm i -g vercel
```

Add `vercel.json` to root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

Deploy with:

```bash
vercel
```

---

## 📁 Folder Structure (Recommended)

```
medicine-shop-server/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   └── modules/
│       └── ... (routes, controllers, models)
│
├── dist/
├── .env
├── .eslintrc.js
├── .prettierrc
├── .prettierignore
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 📦 Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- ESLint & Prettier
- CORS
- Dotenv
- Vercel (for deployment)

---

## If Locally run it at first you need it clone then follow some below step

- npm i
- npm run build
- npm run start:dev

## 🧪 API Endpoints

You can test the API using:

- Postman / Thunder Client
- Or check network requests from the live client

---