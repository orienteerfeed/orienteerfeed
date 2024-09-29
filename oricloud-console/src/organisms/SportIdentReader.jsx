import React, { useState, useEffect, useCallback } from 'react';

export const SportIdentReader = () => {
  const [device, setDevice] = useState(null);
  const [punchData, setPunchData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to the SportIdent reader via USB
  const connectReader = async () => {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x04d8 }], // Replace with the actual vendor ID of the SportIdent reader
      });
      await device.open();
      if (device.configuration === null) {
        await device.selectConfiguration(1);
      }
      await device.claimInterface(0); // Interface 0, assuming the reader uses it
      setDevice(device);
      setIsConnected(true);
      console.log('Connected to SportIdent reader');
      listenToPunches(device);
    } catch (error) {
      console.error('Failed to connect to SportIdent reader:', error);
    }
  };

  // Listen for punches
  const listenToPunches = async (device) => {
    try {
      const reader = await device.transferIn(1, 64); // Endpoint 1, 64 bytes buffer size
      const decoder = new TextDecoder();
      const punch = decoder.decode(reader.data);
      setPunchData(punch);
      console.log('Punch detected:', punch);

      // Continue listening for punches
      listenToPunches(device);
    } catch (error) {
      console.error('Error reading from device:', error);
    }
  };

  // Disconnect reader wrapped in useCallback to ensure stable reference
  const disconnectReader = useCallback(async () => {
    if (device) {
      await device.close();
      setDevice(null);
      setIsConnected(false);
      console.log('Disconnected from SportIdent reader');
    }
  }, [device]);

  useEffect(() => {
    return () => {
      disconnectReader(); // Cleanup on component unmount
    };
  }, [disconnectReader]); // Include disconnectReader in dependency array

  return (
    <div>
      <h1>SportIdent Reader</h1>
      {isConnected ? (
        <div>
          <p>Connected to SportIdent reader</p>
          <button onClick={disconnectReader}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectReader}>Connect Reader</button>
      )}
      {punchData && (
        <div>
          <h2>Punch Data:</h2>
          <pre>{punchData}</pre>
        </div>
      )}
    </div>
  );
};
