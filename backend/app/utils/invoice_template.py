from app.config import settings

GSTIN = "06CIGPA3020C1Z8"
BUSINESS_NAME = "MAKRIVA TRADERS"
LEGAL_NAME = "AMAN"
BUSINESS_ADDRESS = "Safidon Road, Jawahar Nagar, Jind, Haryana – 126102"


def build_invoice_html(order, items: list) -> str:

    rows = ""
    for item in items:
        rows += f"""
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;color:#1a1a2e;font-size:14px">
            {item.product_name}
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;color:#4b5563;font-size:14px">{item.quantity}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;color:#4b5563;font-size:14px">&#8377;{item.price:,.2f}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#1a1a2e;font-size:14px">&#8377;{item.subtotal:,.2f}</td>
        </tr>"""

    discount_row = ""
    if order.discount_amount and order.discount_amount > 0:
        discount_row = f"""
        <tr>
          <td colspan="3" style="padding:6px 8px;text-align:right;color:#16a34a;font-size:13px">
            Discount ({order.discount_code})
          </td>
          <td style="padding:6px 8px;text-align:right;color:#16a34a;font-size:13px">
            &minus;&#8377;{order.discount_amount:,.2f}
          </td>
        </tr>"""

    if order.shipping_charge and order.shipping_charge > 0:
        shipping_row = f"""
        <tr>
          <td colspan="3" style="padding:6px 8px;text-align:right;color:#6b7280;font-size:13px">Shipping</td>
          <td style="padding:6px 8px;text-align:right;color:#6b7280;font-size:13px">&#8377;{order.shipping_charge:,.2f}</td>
        </tr>"""
    else:
        shipping_row = """
        <tr>
          <td colspan="3" style="padding:6px 8px;text-align:right;color:#16a34a;font-size:13px">Shipping</td>
          <td style="padding:6px 8px;text-align:right;color:#16a34a;font-size:13px">FREE</td>
        </tr>"""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Order Confirmation – #{order.order_number}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
  <tr><td align="center">
    <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">

      <!-- ── Header ── -->
      <tr>
        <td style="background:#1a1a2e;padding:24px 32px">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px">MAKRIVA</p>
              </td>
              <td style="text-align:right">
                <p style="margin:0;color:#a0aec0;font-size:12px">Order Invoice</p>
                <p style="margin:4px 0 0;color:#ffffff;font-size:18px;font-weight:700">#{order.order_number}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Seller + Buyer info ── -->
      <tr>
        <td style="padding:24px 32px 0">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <!-- Seller -->
              <td width="50%" style="vertical-align:top;padding-right:16px">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.8px">Sold By</p>
                <p style="margin:0;font-size:14px;font-weight:700;color:#1a1a2e">{BUSINESS_NAME}</p>
                <p style="margin:2px 0 0;font-size:13px;color:#4b5563">{BUSINESS_ADDRESS}</p>
                <p style="margin:6px 0 0;font-size:12px;color:#6b7280">GSTIN: <span style="color:#1a1a2e;font-weight:600">{GSTIN}</span></p>
                <p style="margin:2px 0 0;font-size:11px;color:#9ca3af;font-style:italic">This is not a GST invoice</p>
              </td>
              <!-- Buyer -->
              <td width="50%" style="vertical-align:top;padding-left:16px;border-left:1px solid #f0f0f0">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.8px">Ship To</p>
                <p style="margin:0;font-size:14px;font-weight:700;color:#1a1a2e">{order.shipping_name}</p>
                <p style="margin:2px 0 0;font-size:13px;color:#4b5563;line-height:1.6">
                  {order.shipping_address},<br/>
                  {order.shipping_city}, {order.shipping_state} – {order.shipping_pincode}
                </p>
                <p style="margin:4px 0 0;font-size:13px;color:#4b5563">{order.shipping_phone}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Order meta strip ── -->
      <tr>
        <td style="padding:20px 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:14px 16px">
            <tr>
              <td style="color:#6b7280;font-size:12px;padding:3px 0">Date</td>
              <td style="color:#1a1a2e;font-size:12px;text-align:right;padding:3px 0">
                {order.created_at.strftime("%d %b %Y, %I:%M %p")}
              </td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;padding:3px 0">Payment Status</td>
              <td style="padding:3px 0;text-align:right">
                <span style="background:#fef9c3;color:#854d0e;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:capitalize">
                  {order.payment_status.value}
                </span>
              </td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:12px;padding:3px 0">Order Status</td>
              <td style="padding:3px 0;text-align:right">
                <span style="background:#dbeafe;color:#1e40af;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:capitalize">
                  {order.status.value}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── Items table ── -->
      <tr>
        <td style="padding:0 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <thead>
              <tr style="background:#1a1a2e">
                <th style="padding:10px 8px;text-align:left;font-size:11px;color:#a0aec0;font-weight:600;text-transform:uppercase;letter-spacing:.6px">Item</th>
                <th style="padding:10px 8px;text-align:center;font-size:11px;color:#a0aec0;font-weight:600;text-transform:uppercase;letter-spacing:.6px">Qty</th>
                <th style="padding:10px 8px;text-align:right;font-size:11px;color:#a0aec0;font-weight:600;text-transform:uppercase;letter-spacing:.6px">Rate</th>
                <th style="padding:10px 8px;text-align:right;font-size:11px;color:#a0aec0;font-weight:600;text-transform:uppercase;letter-spacing:.6px">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:10px 8px;text-align:right;color:#6b7280;font-size:13px">Subtotal</td>
                <td style="padding:10px 8px;text-align:right;color:#1a1a2e;font-size:13px">&#8377;{order.subtotal:,.2f}</td>
              </tr>
              {discount_row}
              {shipping_row}
              <tr>
                <td colspan="4" style="padding:0 8px"><hr style="border:none;border-top:2px solid #1a1a2e;margin:4px 0"/></td>
              </tr>
              <tr>
                <td colspan="3" style="padding:10px 8px;text-align:right;font-weight:700;font-size:16px;color:#1a1a2e">Total</td>
                <td style="padding:10px 8px;text-align:right;font-weight:700;font-size:16px;color:#1a1a2e">
                  &#8377;{order.total:,.2f}
                </td>
              </tr>
            </tfoot>
          </table>
        </td>
      </tr>

      <!-- ── CTA ── -->
      <tr>
        <td style="padding:28px 32px;text-align:center">
          <a href="{settings.FRONTEND_URL}/orders/{order.order_number}"
             style="display:inline-block;background:#1a1a2e;color:#ffffff;text-decoration:none;padding:13px 36px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:.5px">
            Track Your Order
          </a>
        </td>
      </tr>

      <!-- ── Footer ── -->
      <tr>
        <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0 0 4px;color:#6b7280;font-size:12px">
            {BUSINESS_NAME} &nbsp;|&nbsp; GSTIN: {GSTIN} &nbsp;|&nbsp; {BUSINESS_ADDRESS}
          </p>
          <p style="margin:0;color:#9ca3af;font-size:11px;line-height:1.6">
            Questions? Email us at
            <a href="mailto:support@makriva.com" style="color:#1a1a2e;text-decoration:none">support@makriva.com</a><br/>
            &copy; {order.created_at.year} Makriva. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>"""
