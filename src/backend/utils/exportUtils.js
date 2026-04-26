import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const PRIMARY_BLUE = [37, 78, 219];
const ELECTRIC_LIME = [163, 230, 53];
const DARK_NAVY = [15, 23, 42];
const LIGHT_GREY = [248, 250, 252];

/**
 * EXPORT TO EXCEL
 */
export const exportToExcel = (bookings) => {
  const data = bookings.map(b => ({
    'Booking ID': `#BK-${b.id}`,
    'Date': formatDate(b.created_at),
    'Customer Name': b.name,
    'Phone': b.phone,
    'Email': b.email || 'N/A',
    'Address': b.address,
    'Service': b.service_types?.join(', ') || 'AC Service',
    'AC Type': b.ac_type,
    'Status': b.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Aerocool Bookings');
  XLSX.writeFile(workbook, `Aerocool_Report_${new Date().getTime()}.xlsx`);
};

/**
 * EXPORT TO PDF (Premium Report)
 */
export const exportToPDF = (bookings) => {
  const doc = new jsPDF('landscape');
  doc.setFillColor(...DARK_NAVY);
  doc.rect(0, 0, 297, 35, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('AEROCOOL', 20, 18);
  doc.setFontSize(8);
  doc.setTextColor(...ELECTRIC_LIME);
  doc.text('PROFESSIONAL AC SOLUTIONS • JAIPUR', 20, 24);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('SYSTEM ANALYTICS REPORT', 210, 18);
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 210, 24);

  const tableData = bookings.map(b => [
    `#BK-${b.id}`,
    formatDate(b.created_at),
    b.name,
    b.phone,
    b.service_types?.[0] || 'AC Service',
    b.ac_type,
    { content: b.status, styles: { fontStyle: 'bold', textColor: b.status === 'Completed' ? [16, 185, 129] : [245, 158, 11] } }
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['ID', 'DATE', 'CUSTOMER', 'PHONE', 'SERVICE', 'UNIT TYPE', 'STATUS']],
    body: tableData,
    headStyles: { fillColor: [...PRIMARY_BLUE], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, cellPadding: 4 },
    alternateRowStyles: { fillColor: [250, 251, 252] },
    margin: { left: 20, right: 20 }
  });

  doc.save(`Aerocool_Report_${new Date().getTime()}.pdf`);
};

/**
 * EXPORT TO DOCX
 */
export const exportToDocx = async (bookings) => {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'AEROCOOL EXPORT', bold: true, size: 36, color: '254EDB' })]
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: ['ID', 'DATE', 'CUSTOMER', 'STATUS'].map(t => new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: t, bold: true })] })],
                shading: { fill: 'f1f5f9' }
              }))
            }),
            ...bookings.map(b => new TableRow({
              children: [`#${b.id}`, formatDate(b.created_at), b.name, b.status].map(t => new TableCell({ children: [new Paragraph({ text: t })] }))
            }))
          ]
        })
      ]
    }]
  });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Aerocool_Summary.docx`);
};

/**
 * GENERATE MODERN WEB3 INVOICE (PDF)
 */
export const generateInvoice = (booking) => {
  const doc = new jsPDF();
  doc.setFillColor(...DARK_NAVY);
  doc.rect(0, 0, 210, 60, 'F');
  doc.setFillColor(...PRIMARY_BLUE);
  doc.triangle(150, 0, 210, 0, 210, 60, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.text('AEROCOOL', 15, 25);
  doc.setFontSize(8);
  doc.setTextColor(...ELECTRIC_LIME);
  doc.text('PREMIUM CLIMATE SOLUTIONS JAIPUR', 15, 32);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.text('INVOICE', 140, 35, { align: 'right' });
  doc.setFontSize(9);
  doc.text(`NO: #INV-${booking.id}${new Date().getFullYear()}`, 140, 42, { align: 'right' });
  doc.text(`DATE: ${formatDate(new Date())}`, 140, 47, { align: 'right' });
  doc.setFillColor(...LIGHT_GREY);
  doc.roundedRect(15, 70, 180, 50, 4, 4, 'F');
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE PROVIDER', 25, 80);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Aerocool Services Jaipur', 25, 86);
  doc.text('Malviya Nagar, Sector 4, Jaipur', 25, 91);
  doc.text('Rajasthan - 302017', 25, 96);
  doc.text('Mobile: +91 80580 28536', 25, 101);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DARK_NAVY);
  doc.text('CUSTOMER DETAILS', 110, 80);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Name: ${booking.name}`, 110, 86);
  doc.text(`Phone: +91 ${booking.phone}`, 110, 91);
  doc.text(`Address: ${booking.address}`, 110, 96, { maxWidth: 75 });
  doc.setFillColor(...DARK_NAVY);
  doc.roundedRect(15, 130, 180, 12, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`UNIT: ${booking.ac_type}`, 25, 138);
  doc.text(`QUANTITY: ${booking.units} Unit(s)`, 70, 138);
  doc.text(`BRAND: ${booking.brand || 'General'}`, 115, 138);
  autoTable(doc, {
    startY: 150,
    head: [['SR.', 'SERVICE DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL AMOUNT']],
    body: [['1', `${booking.service_types?.join(', ') || 'AC Service'}`, booking.units, '0.00', '0.00']],
    headStyles: { fillColor: [...PRIMARY_BLUE] },
    theme: 'striped'
  });
  doc.save(`AEROCOOL_RECEIPT_#BK-${booking.id}.pdf`);
};

/**
 * GENERATE FULL SERVICE JOB CARD (Detailed Full Page PDF)
 */
export const generateJobCard = (booking) => {
  const doc = new jsPDF();
  
  // Header with Logo Placeholder
  doc.setFillColor(...DARK_NAVY);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('AEROCOOL', 15, 18);
  doc.setFontSize(10);
  doc.setTextColor(...ELECTRIC_LIME);
  doc.text('SERVICE JOB CARD • TECHNICIAN COPY', 15, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(`#BK-${booking.id}`, 195, 18, { align: 'right' });
  doc.setFontSize(8);
  doc.text(`STATUS: ${booking.status.toUpperCase()}`, 195, 24, { align: 'right' });

  // 1. Customer Profiling
  doc.setFillColor(...LIGHT_GREY);
  doc.roundedRect(15, 45, 180, 45, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 1: CUSTOMER PROFILE', 25, 55);
  
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer Name: ${booking.name}`, 25, 65);
  doc.text(`Primary Phone: +91 ${booking.phone}`, 25, 72);
  doc.text(`Email Address: ${booking.email || 'N/A'}`, 25, 79);
  
  doc.text(`Alternate Phone: ${booking.alternate_phone || 'N/A'}`, 110, 65);
  doc.text(`Preferred Comms: ${booking.communication_preference || 'Phone'}`, 110, 72);
  doc.text(`Agreed to Terms: YES`, 110, 79);

  // 2. Service Location & Logistics
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 95, 180, 45, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 2: LOCATION & LOGISTICS', 25, 105);
  
  doc.setTextColor(...DARK_NAVY);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Address: ${booking.address}`, 25, 115, { maxWidth: 80 });
  doc.text(`Landmark: ${booking.landmark || 'None'}`, 25, 128);
  
  doc.text(`City: ${booking.city}, ${booking.pincode}`, 110, 115);
  doc.text(`Floor: ${booking.floor_number || 'Ground'} (Lift: ${booking.lift_available ? 'Yes' : 'No'})`, 110, 122);
  doc.text(`Parking: ${booking.parking_available ? 'Available' : 'Restricted'}`, 110, 129);

  // 3. Technical Specifications
  doc.setFillColor(...LIGHT_GREY);
  doc.roundedRect(15, 145, 180, 50, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 3: EQUIPMENT SPECIFICATIONS', 25, 155);
  
  const techData = [
    ['AC Type', booking.ac_type],
    ['Brand', booking.brand || 'Generic'],
    ['Units', `${booking.units} Unit(s)`],
    ['AC Age', booking.ac_age || 'Unknown'],
    ['Services', booking.service_types?.join(', ') || 'N/A']
  ];
  
  autoTable(doc, {
    startY: 160,
    head: [['Technical Field', 'Value']],
    body: techData,
    margin: { left: 25 },
    tableWidth: 160,
    theme: 'plain',
    styles: { fontSize: 8, cellPadding: 2 }
  });

  // 4. Problem Description & Scheduling
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_BLUE);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION 4: PROBLEM DESCRIPTION', 15, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(booking.problem_description || 'No specific problem reported by customer.', 15, finalY + 7, { maxWidth: 180 });

  doc.setTextColor(...DARK_NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text(`SCHEDULED DATE: ${booking.preferred_date}`, 15, finalY + 25);
  doc.text(`TIME SLOT: ${booking.time_slot}`, 110, finalY + 25);

  // 5. Technician Checklist (Internal)
  doc.setDrawColor(...PRIMARY_BLUE);
  doc.setLineWidth(0.5);
  doc.line(15, finalY + 35, 195, finalY + 35);
  
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY_BLUE);
  doc.text('SECTION 5: TECHNICIAN FIELD NOTES (INTERNAL)', 15, finalY + 45);
  
  const checklist = ['Gas Pressure Checked', 'Leakage Tested', 'Filter Cleaned', 'Cooling Verified', 'Customer Satisfied'];
  checklist.forEach((item, i) => {
    doc.rect(20, finalY + 52 + (i * 8), 4, 4);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(item, 28, finalY + 55 + (i * 8));
  });

  doc.text('Additional Notes:', 110, finalY + 55);
  doc.rect(110, finalY + 58, 85, 30);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text('This is a confidential service document generated by Aerocool CRM.', 105, 285, { align: 'center' });

  doc.save(`SERVICE_CARD_#BK-${booking.id}.pdf`);
};
