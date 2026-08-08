import QRCode from 'qrcode'

export function customerQrUrl(customer) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL || '/'}`
  return `${base}customer/${customer.id}`
}

export async function qrDataUrl(text, size = 240) {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  })
}

export function printHtml(title, bodyHtml) {
  const win = window.open('', '_blank', 'width=820,height=1000')
  if (!win) return false
  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #111; padding: 28px; }
    .bill { max-width: 480px; margin: 0 auto; }
    .bill-header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 18px; }
    .bill-header h1 { font-size: 24px; color: #1e3a8a; letter-spacing: .02em; }
    .bill-header p { font-size: 12px; color: #555; margin-top: 2px; }
    .section { margin-bottom: 16px; }
    .section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #777; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 5px 0; font-size: 13px; }
    td.l { font-weight: 600; }
    .total td { font-size: 16px; font-weight: 700; border-top: 2px solid #111; padding-top: 10px; }
    .qr-wrap { text-align: center; margin: 18px 0 6px; }
    .qr-wrap img { width: 190px; height: 190px; }
    .qr-hint { text-align: center; font-size: 12px; color: #555; }
    .thanks { text-align: center; margin-top: 14px; font-size: 12px; color: #555; }
    .muted { color: #666; font-size: 12px; }
  `
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>${css}</style>
</head>
<body>
  <div class="bill">${bodyHtml}</div>
  <script>
    window.onload = function () {
      window.focus();
      window.print();
    }
  </scr` + `ipt>
</body>
</html>`
  win.document.open()
  win.document.write(html)
  win.document.close()
  return true
}
