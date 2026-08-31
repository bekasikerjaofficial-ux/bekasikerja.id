// Server-only Midtrans client (QRIS via Snap API).
// Baca env: MIDTRANS_SERVER_KEY, NEXT_PUBLIC_MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION.
// JANGAN import file ini dari komponen 'use client' — hanya dipakai di route handler.

const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const BASE_URL = IS_PRODUCTION
  ? 'https://api.midtrans.com'
  : 'https://api.sandbox.midtrans.com';

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

export const isMidtransConfigured = Boolean(SERVER_KEY);

// Basic auth: server_key sebagai username, password kosong (Midtrans convention).
function authHeader() {
  const token = Buffer.from(`${SERVER_KEY}:`).toString('base64');
  return { Authorization: `Basic ${token}`, 'Content-Type': 'application/json' };
}

// Buat transaksi QRIS. orderId unik mendampingi (user_id, package_id).
// Midtrans Snap charge: payment_type 'qris' → response.actions[].url = QR string/URL.
export async function createQrisCharge({ orderId, amount, pkgName, userEmail, userName }) {
  if (!isMidtransConfigured) throw new Error('Midtrans belum dikonfigurasi (MIDTRANS_SERVER_KEY).');

  const body = {
    payment_type: 'qris',
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    item_details: [
      { id: pkgName, name: `Paket ${pkgName} BekasiKerja`, price: amount, quantity: 1 },
    ],
    customer_details: {
      email: userEmail || 'member@bekasikerja.id',
      first_name: userName || 'Member',
    },
    qris: { acquirer: 'gopay' }, // default; bank/ewallet lain otomatis di-handle Midtrans
  };

  const res = await fetch(`${BASE_URL}/v2/charge`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_messages ? data.error_messages.join('; ') : `Midtrans charge gagal (${res.status})`);
  }
  // QR content ada di actions[].url dengan method 'GET'
  const qrAction = (data.actions || []).find((a) => a.name === 'generate-qr-code') || (data.actions || [])[0];
  return {
    orderId: data.order_id,
    qrString: qrAction ? qrAction.url : data.qr_string,
    transactionId: data.transaction_id,
    status: data.transaction_status,
  };
}

// Ambil status transaksi (untuk polling fallback di sisi client).
export async function getTransactionStatus(orderId) {
  if (!isMidtransConfigured) throw new Error('Midtrans belum dikonfigurasi.');
  const res = await fetch(`${BASE_URL}/v2/${encodeURIComponent(orderId)}/status`, {
    method: 'GET',
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Midtrans status gagal (${res.status})`);
  return data;
}
