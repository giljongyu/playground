import { PDFDocument } from "pdf-lib";
import { expose } from "comlink";

const pdfWorker = {
  async createPDF(text: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    page.drawText(text, {
      x: 50,
      y: height - 50,
      size: 30,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  },

  async mergePDFs(pdfBytesArray: Uint8Array[]) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfBytes of pdfBytesArray) {
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  },
};

expose(pdfWorker);
