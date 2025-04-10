import { PDFDocument } from "pdf-lib";

self.onmessage = async (event) => {
  const { fileBuffer, action } = event.data;

  const pdfDoc = await PDFDocument.load(fileBuffer);

  if (action === "addText") {
    const pages = pdfDoc.getPages();
    pages[0].drawText("Hello from worker!", {
      x: 50,
      y: 700,
      size: 24,
    });
  }

  const modifiedPdfBytes = await pdfDoc.save();
};
