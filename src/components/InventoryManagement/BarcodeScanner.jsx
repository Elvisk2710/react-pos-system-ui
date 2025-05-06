import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-tailwind/react";
import QrScanner from 'qr-scanner';

const BarcodeScanner = ({ onScan }) => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        result => {
          setScanResult(result);
          onScan(result);
        },
        { highlightScanRegion: true }
      );
      qrScannerRef.current.start();
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        className="w-full h-64 border rounded-lg"
      />
      {scanResult && (
        <Typography className="mt-4">
          Scanned: {scanResult}
        </Typography>
      )}
    </div>
  );
};

export default BarcodeScanner;