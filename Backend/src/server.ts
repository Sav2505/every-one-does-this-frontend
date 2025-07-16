// import express, { Request, Response } from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Middlewares
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type']
// }
// ));
// app.use(express.json());

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// // Sample route
// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello from the server!');
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
