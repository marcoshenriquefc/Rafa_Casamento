import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// export const generateInvitationPdfBuffer = async ({
//   guestName,
//   companions,
//   invitationCode,
//   invitationPassword,
//   qrPayload,
// }) => {
//   const doc = new PDFDocument({ size: 'A4', margin: 48 });
//   const chunks = [];

//   doc.on('data', (chunk) => chunks.push(chunk));

//   const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 180 });
//   const qrImage = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

//   doc.fontSize(24).text('Convite de Casamento', { align: 'center' });
//   doc.moveDown();
//   doc.fontSize(18).text(`Convidado: ${guestName}`);
//   doc.moveDown(0.5);

//   const companionLabel = companions.length
//     ? companions.map((companion) => `• ${companion.name}`).join('\n')
//     : 'Sem acompanhantes';

//   doc.fontSize(14).text(`Acompanhantes:\n${companionLabel}`);
//   doc.moveDown();
//   doc.fontSize(12).text(`ID do convite: ${invitationCode}`);
//   doc.text(`Senha de acesso (5 dígitos): ${invitationPassword}`);
//   doc.moveDown();
//   doc.image(Buffer.from(qrImage, 'base64'), { fit: [180, 180], align: 'center' });
//   doc.moveDown();
//   doc.fontSize(10).text('Use este QRCode para acessar a página de presentes e para check-in na entrada.');

//   doc.end();

//   return await new Promise((resolve) => {
//     doc.on('end', () => resolve(Buffer.concat(chunks)));
//   });
// };

// export const generateInvitationPdfBuffer = async ({
//   guestName,
//   companions,
//   invitationCode,
//   invitationPassword,
//   qrPayload,
// }) => {
//   const doc = new PDFDocument({ size: 'A4', margin: 0 });
//   const chunks = [];

//   doc.on('data', (chunk) => chunks.push(chunk));

//   // 🎨 BACKGROUND
//   doc.image('src/assets/test.jpg', 0, 0, {
//     width: doc.page.width,
//     height: doc.page.height,
//   });

//   // 🎯 QR Code
//   const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
//     margin: 1,
//     width: 180,
//   });

//   const qrImage = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

//   // 🎨 TEXTO
//   doc.fillColor('#ffffff');

//   doc.fontSize(30).text('Você está convidado', 0, 120, {
//     align: 'center',
//   });

//   doc.moveDown();

//   doc.fontSize(22).text(guestName, {
//     align: 'center',
//   });

//   doc.moveDown(1);

//   const companionLabel = companions.length
//     ? companions.map((c) => `• ${c.name}`).join('\n')
//     : 'Sem acompanhantes';

//   doc.fontSize(14).text(companionLabel, {
//     align: 'center',
//   });

//   doc.moveDown(2);

//   // 📌 QR CENTRALIZADO
//   doc.image(Buffer.from(qrImage, 'base64'), doc.page.width / 2 - 90, 420, {
//     width: 180,
//   });

//   doc.moveDown();

//   doc.fontSize(10).text(
//     'Apresente este QR Code na entrada',
//     0,
//     610,
//     { align: 'center' }
//   );

//   // 🔐 Dados pequenos no rodapé
//   doc.fontSize(8).text(
//     `ID: ${invitationCode} | Senha: ${invitationPassword}`,
//     0,
//     750,
//     { align: 'center' }
//   );

//   doc.end();

//   return await new Promise((resolve) => {
//     doc.on('end', () => resolve(Buffer.concat(chunks)));
//   });
// };

export const generateInvitationPdfBuffer = async ({
  guestName,
  companions,
  invitationCode,
  invitationPassword,
  qrPayload,
}) => {
  const doc = new PDFDocument({ size: 'A4', margin: 0 });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // 🖼️ BACKGROUND
  doc.image('src/assets/test.jpg', 0, 0, {
    width: pageWidth,
    height: pageHeight,
  });

  // 🌫️ OVERLAY ESCURO
  doc.rect(0, 0, pageWidth, pageHeight)
    .fillOpacity(0.45)
    .fill('#000');

  doc.fillOpacity(1);

  // 🎨 FONTES (adicione esses arquivos)
  // doc.font('assets/fonts/Montserrat-Regular.ttf');
  safeFont(doc, 'assets/fonts/Montserrat-Regular.ttf');

  // 📝 TÍTULO PEQUENO
  doc.fillColor('#ffffff')
    .fontSize(10)
    .text('CONVITE ESPECIAL', 0, 180, {
      align: 'center',
      characterSpacing: 3,
    });

  // 💍 NOME DO CASAL
  // doc.font('assets/fonts/PlayfairDisplay-Regular.ttf')
  //   .fontSize(36)
  //   .text('João & Maria', 0, 210, {
  //     align: 'center',
  //   });
  safeFont(doc, 'assets/fonts/PlayfairDisplay-Regular.ttf');
  doc.fontSize(36)
    .text('João & Maria', 0, 210, {
      align: 'center',
    });

  // ✉️ SUBTEXTO
  // doc.font('assets/fonts/Montserrat-Light.ttf')
  //   .fontSize(12)
  //   .text('Convidam para o seu casamento', 0, 260, {
  //     align: 'center',
  //   });
  safeFont(doc, 'assets/fonts/Montserrat-Light.ttf');
  doc.fontSize(12)
    .text('Convidam para o seu casamento', 0, 260, {
      align: 'center',
    });

  // 👤 CONVIDADO
  doc.moveDown(0.5);
  doc.fontSize(10)
    .text('CONVIDADO(A)', {
      align: 'center',
      characterSpacing: 2,
    });

  // doc.font('assets/fonts/PlayfairDisplay-Regular.ttf')
  //   .fontSize(18)
  //   .text(guestName, {
  //     align: 'center',
  //   });
  safeFont(doc, 'assets/fonts/PlayfairDisplay-Regular.ttf');
  doc.fontSize(18)
    .text(guestName, {
      align: 'center',
    });

  // 👥 ACOMPANHANTES
  const companionLabel = companions.length
    ? companions.map((c) => `• ${c.name}`).join('\n')
    : 'Sem acompanhantes';

  safeFont(doc, 'assets/fonts/Montserrat-Light.ttf');
  doc.fontSize(10)
    .text('ACOMPANHANTES', {
      align: 'center',
      characterSpacing: 2,
    });

    // Lista os acompanhantes (um por linha)
  doc.fontSize(10)
    .text(companionLabel, {
      align: 'center',
    });


  // 🔳 QR CODE
  const qrCodeDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 180,
    margin: 1,
  });

  const qrImage = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');

  const qrSize = 130;

  doc.image(
    Buffer.from(qrImage, 'base64'),
    pageWidth / 2 - qrSize / 2,
    360,
    { width: qrSize }
  );

  // 🔐 BOX (ID + SENHA)
  const boxWidth = 260;
  const boxX = pageWidth / 2 - boxWidth / 2;
  const boxY = 510;

  // fundo do box
  doc.roundedRect(boxX, boxY, boxWidth, 70, 10)
    .fillOpacity(0.2)
    .fill('#ffffff');

  doc.fillOpacity(1);

  // doc.font('assets/fonts/Montserrat-Regular.ttf')
  //   .fontSize(8)
  //   .fillColor('#ffffff')
  //   .text('SUAS CREDENCIAIS DE ACESSO', boxX, boxY + 10, {
  //     width: boxWidth,
  //     align: 'center',
  //   });
  safeFont(doc, 'assets/fonts/Montserrat-Regular.ttf');
  doc.fontSize(8)
    .fillColor('#ffffff')
    .text('SUAS CREDENCIAIS DE ACESSO', boxX, boxY + 10, {
      width: boxWidth,
      align: 'center',
    });

  doc.fontSize(10)
    .text(`ID: ${invitationCode}`, {
      width: boxWidth,
      align: 'center',
    });

  doc.text(`Senha: ${invitationPassword}`, {
    width: boxWidth,
    align: 'center',
  });

  // 📅 DATA E LOCAL
  // doc.font('assets/fonts/PlayfairDisplay-Regular.ttf')
  //   .fontSize(12)
  //   .text('20 de Dezembro de 2026 · 16:00h', 0, 650, {
  //     align: 'center',
  //   });
    safeFont(doc, 'assets/fonts/PlayfairDisplay-Regular.ttf');
  doc.fontSize(12)
    .text('20 de Dezembro de 2026 · 16:00h', 0, 650, {
      align: 'center',
    });

  // doc.font('assets/fonts/Montserrat-Light.ttf')
  //   .fontSize(10)
  //   .text('Igreja Matriz, São Paulo', {
  //     align: 'center',
  //   });
    safeFont(doc, 'assets/fonts/Montserrat-Light.ttf');
  doc.fontSize(10)
    .text('Igreja Matriz, São Paulo', {
      align: 'center',
    });

  doc.end();

  return await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

export const generateBulkInvitationsPdfBuffer = async ({ guests }) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 28,
    info: {
      Title: 'Convites - Lista completa',
      Author: 'Rafa Casamento Backend',
      Subject: 'Exportação de convites para impressão',
    },
  });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  const columns = 3;
  const rows = 4;
  const itemsPerPage = columns * rows;
  const gapX = 10;
  const gapY = 10;
  const printableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const printableHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
  const cellWidth = (printableWidth - (columns - 1) * gapX) / columns;
  const cellHeight = (printableHeight - (rows - 1) * gapY) / rows;

  for (let i = 0; i < guests.length; i += 1) {
    if (i > 0 && i % itemsPerPage === 0) {
      doc.addPage();
    }

    const slot = i % itemsPerPage;
    const row = Math.floor(slot / columns);
    const col = slot % columns;
    const x = doc.page.margins.left + col * (cellWidth + gapX);
    const y = doc.page.margins.top + row * (cellHeight + gapY);

    const guest = guests[i];
    const qrDataUrl = await QRCode.toDataURL(guest.qrPayload, { width: 120, margin: 1 });
    const qrImage = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');

    doc.roundedRect(x, y, cellWidth, cellHeight, 8).lineWidth(0.8).strokeColor('#d1d5db').stroke();

    const innerPadding = 8;
    const contentX = x + innerPadding;
    let cursorY = y + innerPadding;
    const textWidth = cellWidth - innerPadding * 2;

    doc.font('Helvetica-Bold').fontSize(9).fillColor('#111827').text(guest.name, contentX, cursorY, {
      width: textWidth,
      align: 'center',
    });
    cursorY += 18;

    doc.font('Helvetica').fontSize(8).text(`Código: ${guest.invitationCode}`, contentX, cursorY, {
      width: textWidth,
      align: 'center',
    });
    cursorY += 12;
    doc.text(`Senha: ${guest.invitationPassword}`, contentX, cursorY, {
      width: textWidth,
      align: 'center',
    });
    cursorY += 12;

    const companionsText = guest.companions.length
      ? guest.companions.map((companion) => `• ${companion.name}`).join('\n')
      : 'Sem acompanhantes';

    doc.font('Helvetica-Bold').fontSize(7).text('Acompanhantes', contentX, cursorY, {
      width: textWidth,
      align: 'left',
    });
    cursorY += 10;

    doc.font('Helvetica').fontSize(7).text(companionsText, contentX, cursorY, {
      width: textWidth,
      height: 48,
      ellipsis: true,
    });

    const qrSize = 60;
    const qrX = x + (cellWidth - qrSize) / 2;
    const qrY = y + cellHeight - innerPadding - qrSize - 10;
    doc.image(qrImage, qrX, qrY, { width: qrSize, height: qrSize });
  }

  doc.end();
  return await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

const safeFont = (doc, fontPath, fallback = 'Helvetica') => {
  try {
    doc.font(fontPath);
  } catch (err) {
    console.warn(`Fonte não encontrada: ${fontPath}, usando fallback`);
    doc.font(fallback);
  }
};
