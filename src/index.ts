import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function readDocument() {
  const file = fs.readFileSync('cerfa-autonomie.pdf');
  const pdfDoc = await PDFDocument.load(file, {
    updateMetadata: false,
  });

  const form = pdfDoc.getForm();

  const fields = form.getFields();

  for (const f of fields) {
    try {
      const field = form.getTextField(f.getName());
      field.setText(f.getName());
    } catch (e) {}
  }

  const pdfBytes = await pdfDoc.save();

  fs.appendFileSync('temp/cerfa-autonomie-fill.pdf', Buffer.from(pdfBytes));
}

readDocument();
