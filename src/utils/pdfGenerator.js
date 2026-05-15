import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path'
import { fileURLToPath } from 'url'



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

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  
  const bodoniFont = path.resolve(
    __dirname,
    '../assets/font/BodoniModa-Italic-VariableFont_opsz,wght.ttf'
  )

  doc.registerFont(
      'BodoniModa',
      bodoniFont
  )

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

    doc
      .roundedRect(x, y, cellWidth, cellHeight, 8)
      .fillColor('#ffffff')
      .fill();
    doc
      .roundedRect(x, y, cellWidth, cellHeight, 8)
      .lineWidth(0.8)
      .strokeColor('#d1d5db')
      .stroke();

    const innerPadding = 0;
    const contentX = x + innerPadding;
    let cursorY = y + innerPadding;
    const textWidth = cellWidth - innerPadding * 2;
    const headerHeight = 18;

    const radius = 12

    const rectX = x + 0.6
    const rectY = y + 0.6
    const rectWidth = cellWidth - 1.2
    const rectHeight = headerHeight

    doc
      .moveTo(rectX, rectY + rectHeight)

      // esquerda
      .lineTo(rectX, rectY + radius)

      // canto superior esquerdo
      .quadraticCurveTo(
        rectX,
        rectY,
        rectX + radius,
        rectY
      )

      // topo
      .lineTo(
        rectX + rectWidth - radius,
        rectY
      )

      // canto superior direito
      .quadraticCurveTo(
        rectX + rectWidth,
        rectY,
        rectX + rectWidth,
        rectY + radius
      )

      // direita
      .lineTo(
        rectX + rectWidth,
        rectY + rectHeight
      )

      // base reta
      .lineTo(rectX, rectY + rectHeight)

      .fillColor('#6b92c7')
      .fill()

    doc.font('BodoniModa').fontSize(8).fillColor('#f9fafb').text('Dayara & Rafael', contentX, cursorY + 5, {
      width: textWidth,
      align: 'center',
    });
    
    cursorY += headerHeight + 16;

    doc.font('Helvetica-Bold').fontSize(9).fillColor('#111827').text(guest.name, contentX, cursorY, {
      width: textWidth,
      align: 'center',
    });
    cursorY += 20;

    doc.font('Helvetica').fontSize(8).fillColor('#1f2937').text(`Código: ${guest.invitationCode}`, contentX, cursorY, {
      width: textWidth,
      align: 'center',
    });
    cursorY += 11;
    doc.text(`Senha: ${guest.invitationPassword}`, contentX, cursorY, {
      width: textWidth,
      align: 'center',
    });
    cursorY += 14;

    const hasComanions = guest.companions.map((companion) => `• ${companion.name}`).join('\n')
    if(hasComanions) {
      const companionsText = guest.companions.length
        ? hasComanions
        : 'Sem acompanhantes';
  
      doc.font('Helvetica-Bold').fontSize(7).fillColor('#374151').text('ACOMPANHANTES', contentX, cursorY, {
        width: textWidth,
        align: 'center',
      });
      cursorY += 9;

      doc.font('Helvetica').fontSize(7).fillColor('#4b5563').text(companionsText, contentX, cursorY, {
        width: textWidth,
        align: 'center',
        height: 44,
        ellipsis: true,
      });
    }


    const qrSize = 58;
    const qrX = x + (cellWidth - qrSize) / 2;
    const qrY = y + cellHeight - innerPadding - qrSize - 14;
    doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 5).fillColor('#f9fafb').fill();
    doc.image(qrImage, qrX, qrY, { width: qrSize, height: qrSize });
    doc.font('Helvetica').fontSize(6).fillColor('#6b7280').text('Acesse seu convite', contentX, qrY + qrSize + 3, {
      width: textWidth,
      align: 'center',
    });
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
