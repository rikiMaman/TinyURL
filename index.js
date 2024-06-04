import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from "jsonwebtoken";

import connectToDB from './database.js'
import LinkRouter from './Routers/LinkRouter.js'
import UserRouter from './Routers/UserRouter.js'
import UserModel from './Models/UserModel.js';
import RedirectRouter from './Routers/RedirectRouter.js';

const secret = "JIs%WCfS#Sl454d5FX";
connectToDB()
const app = express()
const port = 5555
app.use(cors())
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//     console.log('aaa');
//     res.send('final project in node')
// })


app.post("/login",async (req, res) => {
    const { email, password } = req.body;
    try {
        const user= await UserModel.findOne({ email: email })
        if (!user) {
            res.status(401).send({ message: "unauthorized" });
        }
        if(user.email==email && user.password==password){
            const token = jwt.sign(
                {userId: user.id, userName: user.name}, secret);
                res.send({accessToken: token})
        }
    }
    catch {
        return res.status(400).json({ message: e.message });
    }
  
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      const newUser = await UserModel.create({ name, email, password });
      const token = jwt.sign(
        { userId: newUser.id, userName: name }, secret
      );
      return res.send({ accessToken: token });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  });
  
const JWTcheck = (req, res, next) =>{
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "No authorization header provided" });
    }
     const token = req.headers.authorization.slice(7);
    console.log("token", token);
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.userId;
      next();
    } catch {
      res.status(401).send({ message: "unauthorized" });
    }
}
app.use('/links', LinkRouter)
app.use('/users', UserRouter)
app.use('/', RedirectRouter)


app.listen(port, () => {
    console.log(`TinyURL app listening on http://localhost:${port}`)
})