import dotenv from 'dotenv';

dotenv.config();

import app from '../src/app.js';

import {
    connectToDatabase
}
from '../src/config/database.js';

export default async function handler(
    req,
    res
) {

    /**
     * Conecta antes
     * de qualquer request
     */
    await connectToDatabase();

    return app(req, res);
}