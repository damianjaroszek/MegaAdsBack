import express, {json, Router} from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errors";
import rateLimit from 'express-rate-limit';
import {adRouter} from "./routers/ad.router";
import {config} from "./config/config";

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));

app.use(json());

app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Limit each IP to 100 requests per window
}));

const router = Router(); // gdy musimy dodać prefix np api/ad dodajemy router

// Routers
router.use('/ad', adRouter);
app.use('/api2', router);

// app.get('/', async(req, res)=>{
//     throw new Error('Something was wrong');  // sprawdzamy czy obsługa błędów działa
// });

// app.get('/', async (req, res) => {
//     throw new ValidationError('Something was wrong');  // sprawdzamy czy obsługa błędów działa
// });

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001');
});
