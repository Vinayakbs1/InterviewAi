// pdf-worker.js
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// Dynamically import the worker
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
