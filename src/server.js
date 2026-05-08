import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';

import {
    connectToDatabase
}
from './config/database.js';

const port =
    process.env.PORT || 3000;

(async () => {

    await connectToDatabase();

    app.listen(port, () => {

        console.log(
            `Servidor rodando na porta ${port}`
        );
    });

})();