import { jsPDF } from 'jspdf';
import { ColoringBook, ColoringPage } from '../types';

// Helper to load an image from URL or data-URL and draw to a canvas to get a clean JPEG/PNG data URL for jsPDF
async function loadImageDataUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 1066;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(url);
        return;
      }
      // Fill white background to prevent transparent SVG black rendering
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => {
      console.warn('Failed to rasterize image for PDF, attempting raw URL fallback:', url);
      resolve(url);
    };
    img.src = url;
  });
}

export interface PdfExportOptions {
  includeDigitalColors?: boolean;
  onProgress?: (current: number, total: number, status: string) => void;
}

export async function exportColoringBookToPdf(
  book: ColoringBook,
  options: PdfExportOptions = {}
): Promise<void> {
  const { includeDigitalColors = false, onProgress } = options;
  const totalSteps = 1 + book.pages.length;

  onProgress?.(0, totalSteps, 'Preparing coloring book layout...');

  // Standard Letter dimensions in points: 612 x 792 (8.5 x 11 inches)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 532 pt

  // ==========================================
  // PAGE 1: PERSONALIZED COVER
  // ==========================================
  onProgress?.(1, totalSteps, 'Building custom cover page...');

  // Outer decorative border
  doc.setDrawColor(20, 24, 39);
  doc.setLineWidth(4);
  doc.roundedRect(margin - 10, margin - 10, contentWidth + 20, pageHeight - margin * 2 + 20, 16, 16);

  // Inner dashed border
  doc.setLineWidth(1.5);
  doc.setLineDashPattern([6, 4], 0);
  doc.roundedRect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4, 10, 10);
  doc.setLineDashPattern([], 0); // reset dash

  // Book Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(17, 24, 39);
  const titleLines = doc.splitTextToSize(book.title.toUpperCase(), contentWidth - 40);
  doc.text(titleLines, pageWidth / 2, margin + 40, { align: 'center' });

  const titleHeight = (titleLines.length - 1) * 26;

  // Personalized Dedication Ribbon
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(75, 85, 99);
  doc.text(
    `Specially Created for ${book.childName} • A 5-Page Story Adventure`,
    pageWidth / 2,
    margin + 70 + titleHeight,
    { align: 'center' }
  );

  // Cover Image Placement
  const coverImageTarget =
    includeDigitalColors && book.cover.coloredDataUrl
      ? book.cover.coloredDataUrl
      : book.cover.imageUrl;

  if (coverImageTarget) {
    try {
      const rasterizedCover = await loadImageDataUrl(coverImageTarget);
      const imgY = margin + 95 + titleHeight;
      const imgHeight = pageHeight - imgY - margin - 55;
      const imgWidth = contentWidth - 40;

      // Maintain 3:4 aspect ratio
      const targetAspect = 3 / 4;
      let finalW = imgWidth;
      let finalH = finalW / targetAspect;
      if (finalH > imgHeight) {
        finalH = imgHeight;
        finalW = finalH * targetAspect;
      }
      const finalX = (pageWidth - finalW) / 2;

      // Draw subtle frame around cover art
      doc.setDrawColor(209, 213, 219);
      doc.setLineWidth(1);
      doc.rect(finalX - 4, imgY - 4, finalW + 8, finalH + 8);

      doc.addImage(rasterizedCover, 'JPEG', finalX, imgY, finalW, finalH);
    } catch (e) {
      console.error('Error adding cover image to PDF:', e);
    }
  }

  // Cover Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(
    'WonderCraft Coloring Books • Black & White Line Art Edition • Ready to Color!',
    pageWidth / 2,
    pageHeight - margin - 10,
    { align: 'center' }
  );

  // ==========================================
  // PAGES 2 TO 6: THE 5 STORY PAGES
  // ==========================================
  for (let i = 0; i < book.pages.length; i++) {
    const page = book.pages[i];
    const pageNum = i + 1;

    onProgress?.(
      pageNum + 1,
      totalSteps,
      `Compiling Page ${pageNum}: ${page.title}...`
    );

    doc.addPage('letter', 'portrait');

    // Page Border
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(2);
    doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 8, 8);

    // Page Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text(`Page ${pageNum}: ${page.title}`, margin + 20, margin + 28);

    // Page Story Description
    if (page.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99);
      const descLines = doc.splitTextToSize(page.description, contentWidth - 40);
      doc.text(descLines, margin + 20, margin + 46);
    }

    // Coloring Page Illustration
    const pageImageTarget =
      includeDigitalColors && page.coloredDataUrl
        ? page.coloredDataUrl
        : page.imageUrl;

    if (pageImageTarget) {
      try {
        const rasterizedPage = await loadImageDataUrl(pageImageTarget);
        const imgStartY = margin + 70;
        const availableHeight = pageHeight - imgStartY - margin - 40;
        const availableWidth = contentWidth - 30;

        // Maintain 3:4 aspect ratio
        const targetAspect = 3 / 4;
        let finalW = availableWidth;
        let finalH = finalW / targetAspect;
        if (finalH > availableHeight) {
          finalH = availableHeight;
          finalW = finalH * targetAspect;
        }
        const finalX = (pageWidth - finalW) / 2;

        // Draw crisp border around line art
        doc.setDrawColor(17, 24, 39);
        doc.setLineWidth(2);
        doc.rect(finalX, imgStartY, finalW, finalH);

        doc.addImage(rasterizedPage, 'JPEG', finalX, imgStartY, finalW, finalH);
      } catch (e) {
        console.error(`Error adding page ${pageNum} image to PDF:`, e);
      }
    }

    // Page Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `${book.childName}'s ${book.theme} Coloring Adventure`,
      margin + 20,
      pageHeight - margin - 15
    );
    doc.text(
      `Page ${pageNum} of ${book.pages.length}`,
      pageWidth - margin - 20,
      pageHeight - margin - 15,
      { align: 'right' }
    );
  }

  onProgress?.(totalSteps, totalSteps, 'Finalizing download...');

  // Save the PDF file to user device
  const cleanName = book.childName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanTheme = book.theme.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${cleanName}_${cleanTheme}_Coloring_Book.pdf`);
}
