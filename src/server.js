import dns from "node:dns/promises";

// 👇 FORÇA DNS antes de qualquer coisa
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from 'dotenv';
import { app } from './app.js';
import { connectToDatabase } from './config/database.js';

dotenv.config();

const port = process.env.PORT || 3000;

(async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
})();
