import PDFDocument from 'pdfkit';

export interface QuotePdfData {
  reference: string;
  status: string;
  issuedAt: Date;
  validUntil: Date;
  customer: {
    name: string;
    email: string;
    phone: string | null;
    address: string;
  };
  repairJob: {
    reference: string;
    equipment: string;
    issue: string;
  } | null;
  items: Array<{
    description: string;
    quantity: number;
    unitPricePence: number;
  }>;
}

const currency = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
}

export function generateQuotePdf(quote: QuotePdfData): Promise<Buffer> {
  const document = new PDFDocument({ size: 'A4', margin: 48 });
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    document.on('data', (chunk: Buffer) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);

    document.font('Helvetica-Bold').fontSize(24).fillColor('#202b33').text('Repair estimate');
    document.moveDown(0.35);
    document.font('Helvetica').fontSize(11).fillColor('#50616b');
    document.text(`Quote ${quote.reference}  |  ${quote.status}`);
    document.text(`Issued ${formatDate(quote.issuedAt)}  |  Valid until ${formatDate(quote.validUntil)}`);
    document.moveDown(1.4);

    document.font('Helvetica-Bold').fontSize(12).fillColor('#202b33').text('Prepared for');
    document.moveDown(0.35);
    document.font('Helvetica').fontSize(10).fillColor('#50616b');
    document.text(quote.customer.name);
    document.text(quote.customer.email);
    if (quote.customer.phone) document.text(quote.customer.phone);
    if (quote.customer.address) document.text(quote.customer.address);
    document.moveDown(1.2);

    if (quote.repairJob) {
      document.font('Helvetica-Bold').fontSize(12).fillColor('#202b33').text('Repair details');
      document.moveDown(0.35);
      document.font('Helvetica').fontSize(10).fillColor('#50616b');
      document.text(`${quote.repairJob.reference}  |  ${quote.repairJob.equipment}`);
      document.text(quote.repairJob.issue);
      document.moveDown(1.2);
    }

    document.font('Helvetica-Bold').fontSize(10).fillColor('#202b33');
    document.text('Description', 48, document.y, { width: 280 });
    document.text('Qty', 340, document.y, { width: 40, align: 'right' });
    document.text('Unit price', 390, document.y, { width: 70, align: 'right' });
    document.text('Amount', 470, document.y, { width: 75, align: 'right' });
    document.moveDown(0.7);
    document.strokeColor('#cbd3d8').moveTo(48, document.y).lineTo(547, document.y).stroke();
    document.moveDown(0.55);

    let subtotalPence = 0;
    for (const item of quote.items) {
      const lineTotalPence = item.quantity * item.unitPricePence;
      subtotalPence += lineTotalPence;
      const descriptionHeight = document.heightOfString(item.description, { width: 280 });
      const rowHeight = Math.max(22, descriptionHeight + 8);

      if (document.y + rowHeight > document.page.height - document.page.margins.bottom - 70) {
        document.addPage();
      }

      const rowY = document.y;
      document.font('Helvetica').fontSize(10).fillColor('#50616b');
      document.text(item.description, 48, rowY, { width: 280 });
      document.text(String(item.quantity), 340, rowY, { width: 40, align: 'right' });
      document.text(currency.format(item.unitPricePence / 100), 390, rowY, {
        width: 70,
        align: 'right',
      });
      document.text(currency.format(lineTotalPence / 100), 470, rowY, {
        width: 75,
        align: 'right',
      });
      document.y = rowY + rowHeight;
    }

    document.moveDown(0.5);
    document.strokeColor('#cbd3d8').moveTo(340, document.y).lineTo(545, document.y).stroke();
    document.moveDown(0.55);
    document.font('Helvetica-Bold').fontSize(12).fillColor('#202b33');
    document.text('Total', 390, document.y, { width: 70, align: 'right' });
    document.text(currency.format(subtotalPence / 100), 470, document.y, {
      width: 75,
      align: 'right',
    });
    document.moveDown(2);
    document.font('Helvetica').fontSize(9).fillColor('#50616b');
    document.text('This estimate is valid until the date shown above. Repair work begins after approval.');
    document.end();
  });
}