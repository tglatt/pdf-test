import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function writePDF(name: string) {
  const file = fs.readFileSync(`${__dirname}/pdf/${name}`);
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

  fs.appendFileSync(`${__dirname}/pdf-marked/${name}`, Buffer.from(pdfBytes));
}

async function markedPDFs() {
  const directoryPath = path.join(__dirname, 'pdf');
  const filenames = fs.readdirSync(directoryPath);
  for (const filename of filenames) {
    console.log(filename);
    try {
      await writePDF(filename);
    } catch (e) {
      console.log(e);
    }
  }
}

markedPDFs();
