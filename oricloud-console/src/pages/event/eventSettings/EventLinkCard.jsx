import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { AiOutlinePrinter } from 'react-icons/ai';
import { LuSend } from 'react-icons/lu';

import { Card } from '../../../organisms';
import { Button } from '../../../atoms';

import { toast } from '../../../utils';
import { config } from '../../../config';

import PATHNAMES from '../../../pathnames';

export const EventLinkCard = ({
  t,
  eventId,
  eventName,
  eventLocation,
  eventDateFormatted,
}) => {
  const qrRef = useRef(null);

  const eventUrl = new URL(
    config.PUBLIC_URL + PATHNAMES.getEventDetail(eventId),
    config.PUBLIC_URL,
  );

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    toast({
      title: t('Operations.Success', { ns: 'common' }),
      description: t('Pages.Event.Link.Toast.CopySuccessDescription'),
      variant: 'success',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const canvas = qrRef.current?.querySelector('canvas');

        if (!canvas) {
          console.error('QR Code not found');
          return;
        }

        const qrImageUrl = canvas.toDataURL('image/png');
        const blob = await fetch(qrImageUrl).then((res) => res.blob()); // Convert base64 to a Blob
        const file = new File([blob], 'event-qr.png', { type: 'image/png' });

        await navigator.share({
          files: [file], // Attach QR Code image
          title: `OrienteerFeed: ${eventName}`,
          text: `📅 Event: ${eventName}
📍 Location: ${eventLocation}
🗓️ Date: ${eventDateFormatted}

🔗 View Live Results: ${eventUrl}

Scan the QR code to access live results instantly!`,
        });

        console.log('Event link shared successfully!');
      } catch (error) {
        console.error('Error sharing event link:', error);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  };

  const generateQRAndPrint = () => {
    const hostUrl = eventUrl.origin; // Extract only the host

    // Wait for the QR Code to render, then convert it to an image
    setTimeout(() => {
      const canvas = qrRef.current?.querySelector('canvas');

      if (!canvas) {
        console.error('QR Code not found');
        return;
      }

      const qrImageUrl = canvas.toDataURL('image/png');

      // Open print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      // Generate printable HTML content
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - OrienteerFeed Live Results</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .qr-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
              }
              .qr-code {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 10px;
              }
              .info {
                margin-top: 10px;
                font-size: 14px;
                color: #555;
              }
              @media print {
                body { visibility: hidden; }
                .qr-container { visibility: visible; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>ORIENTEERFEED</h1>
              <div class="qr-code">
                <img src="${qrImageUrl}" alt="QR Code">
              </div>
              <p class="info">Scan this QR code to view live results online.</p>
              <p><strong>${hostUrl}</strong></p>
            </div>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    }, 300); // Delay to ensure QR code is rendered
  };

  return (
    <>
      {/* <!-- Event Form --> */}
      <Card
        title={t('Pages.Event.Link.Card.Title')}
        description={t('Pages.Event.Link.Card.Description')}
      >
        <div ref={qrRef} className="hidden">
          <QRCodeCanvas value={eventUrl} size={300} level="H" />
        </div>
        <div className="inline-flex space-x-2">
          <Button onClick={handleShare}>
            {t('Share', { ns: 'common' })}
            <span className="ml-2">
              <LuSend />
            </span>
          </Button>
          <Button onClick={generateQRAndPrint}>
            {t('Print', { ns: 'common' })}{' '}
            <span className="ml-2">
              <AiOutlinePrinter />
            </span>
          </Button>
          <Button onClick={copyLinkToClipboard}>
            {t('Copy', { ns: 'common' })} URL
          </Button>
        </div>
      </Card>
    </>
  );
};
