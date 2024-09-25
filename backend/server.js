import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import FarmerRoutes from './routes/FarmerRoutes.js';
import EcoCenterRoutes from './routes/EconomicCenterRoutes.js';
import AgriculturalOfficerRoutes from './routes/AgriculturalOfficerRoutes.js';
import FarmerLRoutes from './routes/FarmerLRoutes.js';
import Stock from './routes/ECMOroutes/stock.js';
import priceList from './routes/ECMOroutes/PriceList.js';
import AORoutes from './routes/AORoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import './auth.js';
import passport from 'passport';
import session from 'express-session';

const app = express();

const PORT = process.env.PORT || 8075;
app.use(cors());
app.use(bodyParser.json());

dotenv.config();

const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    })
  )
  .catch((err) => console.log(err));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/ao/dashboard',
    failureRedirect: '/auth/google/failure',
  })
);

app.get ('/auth/google/failure', (req, res) => {
  res.send ('Something went wrong!');
});


app.get ('/auth/protected', isLoggedIn, (req, res) => {
  let name = req.user.displayName;
  res.send (`Hello ${name}`);
});

app.use ('/auth/logout', (req, res) => {
  req.session.destroy ();
  res.send ('See you again!');
});

//routes-----------------------------------------------------------------
app.use('/farmers', FarmerRoutes);
app.use('/ecocenters', EcoCenterRoutes);
app.use('/agriofficers', AgriculturalOfficerRoutes);
app.use('/stock', Stock);
app.use('/priceList', priceList);
app.use('/farmerL', FarmerLRoutes);
app.use('/ao', AORoutes);
app.use('/admin', AdminRoutes);
