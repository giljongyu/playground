import * as Comlink from "comlink";
import * as PdfLib from "pdf-lib";

export class PdfLibWorker {
  async hello() {
    console.log("hellogdfsmlk");
    const doc = PdfLib.PDFDocument.create();
    console.log("hello");
    return "heldsadsalo";
  }
}

Comlink.expose(new PdfLibWorker());
