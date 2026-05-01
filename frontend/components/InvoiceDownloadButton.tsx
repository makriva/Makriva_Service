'use client';

import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

interface OrderItem {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  order_number: string;
  created_at: string;
  status: string;
  payment_status: string;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  subtotal: number;
  discount_amount: number;
  discount_code: string | null;
  shipping_charge: number;
  total: number;
  items: OrderItem[];
}

// Helvetica (jsPDF default) cannot encode ₹ — use Rs. prefix instead
function rs(amount: number) {
  return `Rs. ${amount.toFixed(2)}`;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function fetchImageBase64(url: string): Promise<string | null> {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror  = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Brand colour tuples
const GOLD  = [212, 175,  55] as [number, number, number];
const DARK  = [ 28,  28,  28] as [number, number, number];
const GRAY  = [104, 107, 120] as [number, number, number];
const GREEN = [ 22, 163,  74] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const LIGHT = [248, 249, 250] as [number, number, number];

export default function InvoiceDownloadButton({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W   = doc.internal.pageSize.getWidth();   // 210 mm
      const H   = doc.internal.pageSize.getHeight();  // 297 mm
      const M   = 14;   // left / right margin

      // ── Fetch logo ──────────────────────────────────────────
      const logoUrl = 'https://res.cloudinary.com/dsqzdclae/image/upload/f_png,q_auto,w_200/v1776442607/makriva-v2/makriva-logo.png';
      const logoB64 = await fetchImageBase64(logoUrl);

      // ── Gold top bar ─────────────────────────────────────────
      doc.setFillColor(...GOLD);
      doc.rect(0, 0, W, 6, 'F');

      // ── Header row ───────────────────────────────────────────
      // Left: logo + company text
      let logoH = 0;
      if (logoB64) {
        doc.addImage(logoB64, 'PNG', M, 9, 36, 14);
        logoH = 14;
      }
      const leftY = 9 + logoH + 3;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      doc.text('makriva.in  |  support@makriva.in  |  +91-83980-30577', M, leftY);

      // Right: TAX INVOICE + meta
      const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(...GOLD);
      doc.text('TAX INVOICE', W - M, 16, { align: 'right' });

      const metaRows: [string, string][] = [
        ['Invoice No', order.order_number],
        ['Date',       invoiceDate],
        ['Status',     cap(order.status)],
        ['Payment',    cap(order.payment_status)],
      ];
      let ry = 22;
      const labelX = W - M - 52;
      metaRows.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.8);
        doc.setTextColor(...GRAY);
        doc.text(`${label}:`, labelX, ry);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...DARK);
        doc.text(value, W - M, ry, { align: 'right' });
        ry += 4.8;
      });

      // ── Gold rule ────────────────────────────────────────────
      const ruleY = Math.max(leftY + 6, ry + 3);
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.5);
      doc.line(M, ruleY, W - M, ruleY);

      // ── Bill To card ─────────────────────────────────────────
      const cardY = ruleY + 5;
      doc.setFillColor(...LIGHT);
      doc.setDrawColor(225, 225, 225);
      doc.setLineWidth(0.2);
      doc.roundedRect(M, cardY, W - 2 * M, 32, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(...GOLD);
      doc.text('BILL TO / SHIP TO', M + 4, cardY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...DARK);
      doc.text(order.shipping_name.toUpperCase(), M + 4, cardY + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text(order.shipping_address, M + 4, cardY + 18);
      doc.text(`${order.shipping_city}, ${order.shipping_state} — ${order.shipping_pincode}`, M + 4, cardY + 23);
      doc.text(`Ph: ${order.shipping_phone}   |   ${order.shipping_email}`, M + 4, cardY + 28);

      // ── Payment method line ───────────────────────────────────
      const pmY = cardY + 38;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GRAY);
      doc.text('Payment Method:', M, pmY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...DARK);
      doc.text('Cash on Delivery', M + 30, pmY);

      // ── Items table ───────────────────────────────────────────
      const tableY = pmY + 6;
      autoTable(doc, {
        startY: tableY,
        head: [['#', 'Product', 'Qty', 'Rate (Rs.)', 'Amount (Rs.)']],
        body: order.items.map((item, i) => [
          i + 1,
          item.product_name,
          item.quantity,
          item.price.toFixed(2),
          item.subtotal.toFixed(2),
        ]),
        margin: { left: M, right: M },
        headStyles: {
          fillColor: DARK,
          textColor: WHITE,
          fontStyle: 'bold',
          fontSize: 8.5,
          cellPadding: { top: 4, bottom: 4, left: 3, right: 3 },
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: DARK,
          cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 10,  halign: 'center' },
          1: { halign: 'left' },
          2: { cellWidth: 14,  halign: 'center' },
          3: { cellWidth: 28,  halign: 'right' },
          4: { cellWidth: 32,  halign: 'right' },
        },
        theme: 'grid',
        tableLineColor: [215, 215, 215],
        tableLineWidth: 0.2,
      });

      // ── Bill summary ──────────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const afterTable: number = (doc as any).lastAutoTable.finalY;

      // Summary box: fixed width 80mm, right-aligned within page margins
      const BOX_W = 80;
      const BOX_X = W - M - BOX_W;
      const discountRow = order.discount_amount > 0 ? 1 : 0;
      const rowH   = 7;
      const BOX_H  = (3 + discountRow) * rowH + 16;

      let sy = afterTable + 8;

      doc.setFillColor(...LIGHT);
      doc.setDrawColor(215, 215, 215);
      doc.setLineWidth(0.2);
      doc.roundedRect(BOX_X, sy, BOX_W, BOX_H, 2, 2, 'FD');

      sy += 6; // inner top padding

      const summaryRow = (
        label: string,
        value: string,
        valueColor: [number, number, number] = DARK,
        bold = false,
      ) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...GRAY);
        doc.text(label, BOX_X + 5, sy);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setFontSize(bold ? 9.5 : 8.5);
        doc.setTextColor(...valueColor);
        doc.text(value, BOX_X + BOX_W - 5, sy, { align: 'right' });
        sy += rowH;
      };

      summaryRow('Subtotal', rs(order.subtotal));
      if (order.discount_amount > 0) {
        summaryRow(
          `Discount${order.discount_code ? ` (${order.discount_code})` : ''}`,
          `- ${rs(order.discount_amount)}`,
          GREEN,
        );
      }
      summaryRow(
        'Shipping',
        order.shipping_charge === 0 ? 'FREE' : rs(order.shipping_charge),
        order.shipping_charge === 0 ? GREEN : DARK,
      );

      // Divider inside box
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.4);
      doc.line(BOX_X + 5, sy - 1, BOX_X + BOX_W - 5, sy - 1);
      sy += 4;

      // TOTAL row
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...DARK);
      doc.text('TOTAL', BOX_X + 5, sy);
      doc.setFontSize(11);
      doc.setTextColor(...GOLD);
      doc.text(rs(order.total), BOX_X + BOX_W - 5, sy, { align: 'right' });
      sy += 5;

      // ── COD note ──────────────────────────────────────────────
      if (order.payment_status !== 'paid') {
        const noteY = afterTable + 8 + BOX_H + 6;
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.8);
        doc.setTextColor(...GRAY);
        doc.text(`Pay ${rs(order.total)} when your order arrives.`, M, noteY);
      }

      // ── Footer ────────────────────────────────────────────────
      const FY = H - 18;
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.3);
      doc.line(M, FY, W - M, FY);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(...GRAY);
      doc.text(
        'This is a computer-generated invoice and does not require a physical signature.',
        W / 2, FY + 4.5, { align: 'center' },
      );
      doc.text(
        'Thank you for shopping with MakRiva!  |  support@makriva.in  |  +91-83980-30577  |  makriva.in',
        W / 2, FY + 9, { align: 'center' },
      );

      // ── Gold bottom bar ───────────────────────────────────────
      doc.setFillColor(...GOLD);
      doc.rect(0, H - 6, W, 6, 'F');

      // ── Save ──────────────────────────────────────────────────
      doc.save(`MakRiva-Invoice-${order.order_number}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 text-sm font-semibold bg-white border border-[#E9E9EB] hover:border-brand hover:text-brand text-[#1C1C1C] px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <FiDownload size={14} className={loading ? 'animate-bounce' : ''} />
      {loading ? 'Generating…' : 'Download Invoice'}
    </button>
  );
}
