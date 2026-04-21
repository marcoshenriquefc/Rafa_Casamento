import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export const generateInvitationPdfBuffer = async ({
  guestName,
  companions,
  invitationCode,
  invitationPassword,
  qrPayload,
}) => {
  const doc = new PDFDocument({ size: 'A4', margin: 48 });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 180 });
  const qrImage = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

  doc.fontSize(24).text('Convite de Casamento', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(`Convidado: ${guestName}`);
  doc.moveDown(0.5);

  const companionLabel = companions.length
    ? companions.map((companion) => `• ${companion.name}`).join('\n')
    : 'Sem acompanhantes';

  doc.fontSize(14).text(`Acompanhantes:\n${companionLabel}`);
  doc.moveDown();
  doc.fontSize(12).text(`ID do convite: ${invitationCode}`);
  doc.text(`Senha de acesso (5 dígitos): ${invitationPassword}`);
  doc.moveDown();
  doc.image(Buffer.from(qrImage, 'base64'), { fit: [180, 180], align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text('Use este QRCode para acessar a página de presentes e para check-in na entrada.');

  doc.end();

  return await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
