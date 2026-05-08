import { jsPDF } from "jspdf";

export async function generatePdfFromImage(imageUrl: string, title: string): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  // في بيئة السيرفر، نحتاج لجلب الصورة أولاً
  // ملاحظة: إذا كانت الصورة خارجية، يجب التأكد من صلاحيات الوصول
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const imageData = `data:image/png;base64,${base64}`;

  const imgProps = doc.getImageProperties(imageData);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  doc.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
  
  // إضافة عنوان في أسفل الصفحة
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`ColoPaper - ${title}`, pdfWidth / 2, 290, { align: "center" });

  return Buffer.from(doc.output("arraybuffer"));
}
