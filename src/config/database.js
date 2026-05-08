import mongoose from 'mongoose';

let cached =
    global.mongoose;

if (!cached) {

    cached =
        global.mongoose = {

            conn: null,
            promise: null,
        };
}

export const connectToDatabase =
    async () => {

        /**
         * PEGA ENV AQUI
         */
        const MONGO_URI =
            process.env.MONGO_URI;

        if (!MONGO_URI) {

            throw new Error(
                'MONGO_URI não configurada.'
            );
        }

        /**
         * reutiliza conexão
         */
        if (cached.conn) {

            return cached.conn;
        }

        /**
         * evita múltiplas conexões
         */
        if (!cached.promise) {

            cached.promise =
                mongoose.connect(
                    MONGO_URI,
                    {
                        bufferCommands: false,

                        serverSelectionTimeoutMS: 5000,
                    }
                );
        }

        cached.conn =
            await cached.promise;

        console.log(
            'MongoDB conectado.'
        );

        return cached.conn;
    };