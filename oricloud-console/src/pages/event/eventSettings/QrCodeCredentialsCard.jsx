import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card } from '../../../organisms';

export const QrCodeCredentialsCard = ({ t, eventId, eventPassword, url }) => {
  // Format the service credentials
  const serviceCredentials = `ORIENTEERFEED:U:${url};T:BASIC;EVENT:${eventId};PASSWORD:${eventPassword};;`;
  const codeSize = 200; // Set the size you want for the QR code
  const errorCorrectionLevel = 'L'; // Set the desired error correction level - values L, M, Q, H,

  // Low (L): Least dense, but the QR code is more space-efficient. Best used when you have minimal space and the code is unlikely to be damaged.
  // Medium (M): A balance between size and error correction. This is a good option for most use cases.
  // Quartile (Q): A higher density with more error correction, useful in environments where the QR code may get partially obscured or damaged.
  // High (H): Most error correction, but the code will be larger and denser.

  return (
    <Card
      title={t('Pages.Event.QrCode.Card.Title')}
      description={t('Pages.Event.QrCode.Card.Description')}
    >
      <div className="flex justify-center items-center">
        <QRCodeCanvas
          value={serviceCredentials}
          size={codeSize}
          level={errorCorrectionLevel}
        />
      </div>
      <div className="flex justify-center items-center">
        <ul>
          <li>
            <b>url: </b> {url}
          </li>
          <li>
            <b>eventId: </b> {eventId}
          </li>
          {/* <li>
            <b>password: </b> {eventPassword}
          </li> */}
        </ul>
      </div>
    </Card>
  );
};
