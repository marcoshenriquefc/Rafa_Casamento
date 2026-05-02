import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { HttpError } from '../utils/httpError.js';

const getClient = () => {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    throw new HttpError(500, 'Mercado Pago não configurado. Defina MP_ACCESS_TOKEN no .env.');
  }

  return new MercadoPagoConfig({ accessToken });
};

export const mercadoPagoService = {
  async createGiftPreference({ guest, items, externalReference }) {
    const client = getClient();
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items,
        payer: { name: guest.name, email: guest.email },
        external_reference: externalReference,
        notification_url: process.env.MP_WEBHOOK_URL,
        back_urls: {
          success: process.env.MP_SUCCESS_URL,
          failure: process.env.MP_FAILURE_URL,
          pending: process.env.MP_PENDING_URL,
        },
        auto_return: 'approved',
      },
    });

    return response;
  },

  async getPayment(paymentId) {
    const client = getClient();
    const payment = new Payment(client);
    return payment.get({ id: paymentId });
  },
};
