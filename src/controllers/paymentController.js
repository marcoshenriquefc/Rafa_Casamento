import { mercadoPagoService } from '../services/mercadoPagoService.js';

export const paymentController = {
  async createPreference(req, res, next) {
    try {
      const { payer, items, externalReference, metadata, backUrls } = req.validated.body;
      const preference = await mercadoPagoService.createGenericPreference({
        payer,
        items,
        externalReference,
        metadata,
        backUrls,
      });

      return res.status(201).json({
        preferenceId: preference.id,
        checkoutUrl: preference.init_point,
        sandboxCheckoutUrl: preference.sandbox_init_point,
        externalReference,
      });
    } catch (error) {
      return next(error);
    }
  },
};
