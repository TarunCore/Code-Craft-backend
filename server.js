import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { IoManager } from './Managers/IoManager.js';
import { MongoManager } from './Managers/MongoManager.js';
import { appRouter } from './user/user.js';
const PORT = process.env.PORT ||3000;
const PORT_SIO = process.env.PORT2 ||3001;

const app = express()
app.use(cors(
    {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type",
      credentials: true
    }
  ))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.use(express.json())
app.get("/",(req, res)=>{
    res.send("Server running at"+process.env.PORT)
})
app.use("/",appRouter)
const httpServer = createServer(app);
const httpServer2 = createServer(app);
const sockserver = new WebSocketServer({ server: httpServer })
sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.onerror = function () {
        // console.log('websocket error')
    }
})
export const iomanage = new IoManager(httpServer);
export const mongoManager = new MongoManager();
httpServer.listen(PORT, ()=>{
    mongoManager.connect().catch(err => console.log(err));
    // console.log("http://localhost:1234")
})
// httpServer2.listen(PORT_SIO, ()=>{
//     // console.log("http://localhost:3000")
// })