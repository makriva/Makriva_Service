import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List

from app.config import settings

logger = logging.getLogger(__name__)

STATUS_LABELS = {
    "pending":    ("Order Received", "#6b7280"),
    "confirmed":  ("Order Confirmed", "#2563eb"),
    "processing": ("Being Processed", "#d97706"),
    "shipped":    ("Shipped", "#7c3aed"),
    "delivered":  ("Delivered", "#16a34a"),
    "cancelled":  ("Cancelled", "#dc2626"),
    "refunded":   ("Refunded", "#6b7280"),
}


def _smtp():
    # Port 465 uses SMTP_SSL (direct TLS), unlike port 587 which uses STARTTLS
    server = smtplib.SMTP_SSL(settings.ZOHO_SMTP_HOST, settings.ZOHO_SMTP_PORT, timeout=20)
    server.ehlo()
    server.login(settings.ZOHO_SENDER_EMAIL, settings.ZOHO_SMTP_PASSWORD)
    return server


def _send(to: str, subject: str, html: str) -> bool:
    if not settings.ZOHO_SMTP_PASSWORD:
        logger.warning("ZOHO_SMTP_PASSWORD not set — skipping email")
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"Makriva <{settings.ZOHO_SENDER_EMAIL}>"
        msg["To"] = to
        msg.attach(MIMEText(html, "html"))
        with _smtp() as server:
            server.sendmail(settings.ZOHO_SENDER_EMAIL, to, msg.as_string())
        return True
    except smtplib.SMTPException as exc:
        logger.error("SMTP error to %s: %s", to, exc)
        return False
    except Exception as exc:
        logger.error("Email error to %s: %s", to, exc)
        return False


def send_order_invoice_email(order, items: list) -> bool:
    from app.utils.invoice_template import build_invoice_html
    html = build_invoice_html(order, items)
    ok = _send(order.shipping_email, f"Order Confirmed — #{order.order_number} | Makriva", html)
    if ok:
        logger.info("Invoice email sent for order %s", order.order_number)
    return ok


def send_order_status_email(order) -> bool:
    status_val = order.status.value if hasattr(order.status, "value") else str(order.status)
    label, color = STATUS_LABELS.get(status_val, (status_val.title(), "#1a1a2e"))
    tracking_row = ""
    if order.tracking_number:
        track_link = f'<a href="{order.tracking_url}" style="color:#1a1a2e">{order.tracking_number}</a>' if order.tracking_url else order.tracking_number
        tracking_row = f"""
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px">Tracking</td>
          <td style="padding:6px 0;font-size:13px;text-align:right">{track_link}</td>
        </tr>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
      <tr>
        <td style="background:#1a1a2e;padding:24px 32px;text-align:center">
          <p style="margin:0;color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px">MAKRIVA</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px 0">
          <div style="display:inline-block;background:{color}20;border:1px solid {color}40;border-radius:20px;padding:4px 14px;margin-bottom:16px">
            <span style="color:{color};font-weight:700;font-size:13px">{label}</span>
          </div>
          <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:20px">Hi {order.shipping_name},</h2>
          <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.6">
            Your order status has been updated to <strong style="color:{color}">{label}</strong>.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:16px">
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px">Order Number</td>
              <td style="padding:6px 0;font-size:13px;font-weight:600;text-align:right">#{order.order_number}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#6b7280;font-size:13px">Total</td>
              <td style="padding:6px 0;font-size:13px;font-weight:600;text-align:right">&#8377;{order.total:,.2f}</td>
            </tr>
            {tracking_row}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 32px 28px;text-align:center">
          <a href="{settings.FRONTEND_URL}/orders/{order.order_number}"
             style="display:inline-block;background:#1a1a2e;color:#fff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600">
            View Order
          </a>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:11px">
            Questions? <a href="mailto:team@makriva.in" style="color:#1a1a2e;text-decoration:none">team@makriva.in</a>
            &nbsp;&middot;&nbsp; &copy; {order.created_at.year} Makriva Traders &middot; GSTIN: 06CIGPA3020C1Z8
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>"""
    ok = _send(order.shipping_email, f"Order Update — #{order.order_number} | Makriva", html)
    if ok:
        logger.info("Status email sent for order %s (%s)", order.order_number, status_val)
    return ok


def send_contact_reply_email(to_email: str, to_name: str, original_subject: str, reply_body: str) -> bool:
    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
      <tr>
        <td style="background:#1a1a2e;padding:24px 32px;text-align:center">
          <p style="margin:0;color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px">MAKRIVA</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px">
          <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:20px">Hi {to_name},</h2>
          <p style="margin:0 0 16px;color:#6b7280;font-size:13px">Re: {original_subject}</p>
          <div style="color:#1a1a2e;font-size:15px;line-height:1.7;white-space:pre-wrap">{reply_body}</div>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:11px">
            Makriva Traders &middot; <a href="mailto:team@makriva.in" style="color:#1a1a2e;text-decoration:none">team@makriva.in</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>"""
    return _send(to_email, f"Re: {original_subject} | Makriva", html)


def send_bulk_email(to_emails: List[str], subject: str, body: str) -> dict:
    if not settings.ZOHO_SMTP_PASSWORD:
        return {"sent": 0, "failed": len(to_emails)}
    sent, failed = 0, 0
    try:
        with _smtp() as server:
            for email in to_emails:
                try:
                    msg = MIMEMultipart("alternative")
                    msg["Subject"] = subject
                    msg["From"] = f"Makriva <{settings.ZOHO_SENDER_EMAIL}>"
                    msg["To"] = email
                    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
      <tr><td style="background:#1a1a2e;padding:24px 32px;text-align:center">
        <p style="margin:0;color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px">MAKRIVA</p>
      </td></tr>
      <tr><td style="padding:28px 32px;color:#1a1a2e;font-size:15px;line-height:1.7;white-space:pre-wrap">{body}</td></tr>
      <tr><td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="margin:0;color:#9ca3af;font-size:11px">Makriva Traders &middot; team@makriva.in</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>"""
                    msg.attach(MIMEText(html, "html"))
                    server.sendmail(settings.ZOHO_SENDER_EMAIL, email, msg.as_string())
                    sent += 1
                except Exception as exc:
                    logger.error("Failed sending to %s: %s", email, exc)
                    failed += 1
    except Exception as exc:
        logger.error("SMTP session error: %s", exc)
        failed += len(to_emails) - sent
    return {"sent": sent, "failed": failed}
