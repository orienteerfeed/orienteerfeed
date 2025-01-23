import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '../../../atoms';
import { Card } from '../../../organisms';

export const QrCodeCredentialsCard = ({
  t,
  eventId,
  eventPassword,
  url,
  host,
}) => {
  const qrCodeRef = useRef(null); // Reference to the QR code canvas
  // Format the service credentials
  const serviceCredentials = `ORIENTEERFEED:U:${url};T:BASIC;EVENT:${eventId};PASSWORD:${eventPassword};;`;
  const codeSize = 200; // Set the size you want for the QR code
  const errorCorrectionLevel = 'L'; // Set the desired error correction level - values L, M, Q, H,

  // Low (L): Least dense, but the QR code is more space-efficient. Best used when you have minimal space and the code is unlikely to be damaged.
  // Medium (M): A balance between size and error correction. This is a good option for most use cases.
  // Quartile (Q): A higher density with more error correction, useful in environments where the QR code may get partially obscured or damaged.
  // High (H): Most error correction, but the code will be larger and denser.

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const canvas = qrCodeRef.current; // Get the QR code canvas element
        const dataUrl = canvas.toDataURL('image/png'); // Convert the canvas to base64 PNG
        const blob = dataURLToBlob(dataUrl); // Convert base64 to a Blob
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });

        await navigator.share({
          files: [file], // Share the QR code image
          title: 'OrienteerFeed QR Code',
          text: 'Here is the QR code for the O-Feed event to pair your mobile app O-Checklist!',
        });
        console.log('QR code shared successfully!');
      } catch (error) {
        console.error('Error sharing QR code:', error);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  const handlePrint = () => {
    const canvas = qrCodeRef.current; // Get the QR code canvas element
    const dataUrl = canvas.toDataURL('image/png'); // Convert canvas to a base64 image
    const printWindow = window.open('', '_blank'); // Open a new window
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;
                color: #333;
                line-height: 1.6;
              }
              .container {
                text-align: center;
                margin-top: 20px;
              }
              .header {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .subheader {
                font-size: 18px;
                margin-bottom: 20px;
                color: #555;
              }
              .qr-code {
                margin: 20px auto;
                display: block;
                width: 300px;
                height: 300px;
              }
              .details {
                margin-top: 20px;
                text-align: left;
                font-size: 16px;
                display: inline-block;
              }
              .details span {
                display: block;
                margin-bottom: 8px;
              }
              .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header"><h1>ORIENTEERFEED</h1></div>
              <div class="subheader">Scan this QR code to pair your mobile app O-Checklist with the event.</div>
              <img src="${dataUrl}" class="qr-code" alt="QR Code" />
              <div class="details">
                <span><strong>Host:</strong> ${host}</span>
                <span><strong>Event ID:</strong> ${eventId}</span>
                <span><strong>Event Password:</strong> ${eventPassword}</span>
              </div>
              <div class="footer">
                Please keep this information secure. If you encounter any issues, contact support.
              </div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Utility to convert base64 data URL to Blob
  const dataURLToBlob = (dataUrl) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <Card
      title={t('Pages.Event.QrCode.Card.Title')}
      description={t('Pages.Event.QrCode.Card.Description')}
    >
      <div className="flex flex-col gap-4 justify-between">
        <div className="flex justify-center">
          <QRCodeCanvas
            value={serviceCredentials}
            size={codeSize}
            level={errorCorrectionLevel}
            ref={qrCodeRef} // Reference the QR code canvas
          />
        </div>
        <div className="flex justify-center">
          <ul>
            <li>
              <b>{t('Pages.Event.QrCode.Card.Host')}: </b> {host}
            </li>
            <li>
              <b>{t('Pages.Event.QrCode.Card.EventId')}: </b> {eventId}
            </li>
          </ul>
        </div>
        <div className="flex items-end gap-2 mt-4">
          <Button
            onClick={handleShare}
            title={t('Pages.Event.QrCode.Card.ShareQrCode')}
          >
            {t('Share', { ns: 'common' })}
          </Button>
          <Button
            onClick={handlePrint}
            title={t('Pages.Event.QrCode.Card.PrintQrCode')}
          >
            {t('Print', { ns: 'common' })}
          </Button>
        </div>
      </div>
    </Card>
  );
};
