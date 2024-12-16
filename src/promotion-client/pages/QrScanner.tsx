import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScan }) => {
  const [result, setResult] = useState("No result");
  const scannerRef = useRef(null); // Referencia al contenedor donde se montará el escáner

  useEffect(() => {
    if (!scannerRef.current) return; // Esperar a que el contenedor esté disponible

    // Configuración del escáner
    const qrScanner = new Html5QrcodeScanner(scannerRef.current, {
      fps: 10, // Frames por segundo (ajusta según el rendimiento)
      qrbox: 250, // Tamaño del área del escáner
    });

    // Iniciar el escáner
    qrScanner.render(
      (qrCode) => {
        setResult(qrCode); // Setea el resultado cuando se escanea un QR
        onScan(qrCode); // Llama a la función onScan con el código escaneado
      },
      (errorMessage) => {
        console.error("Error reading QR:", errorMessage);
      }
    );

    // Limpiar cuando el componente se desmonte
    return () => {
      qrScanner.clear();
    };
  }, [onScan]);

  return (
    <div>
      {/* Contenedor donde se monta el escáner */}
      <div ref={scannerRef} style={{ width: "100%", height: "auto" }}></div>

      {/* Mostrar el resultado */}
      <p>{result}</p>
    </div>
  );
};

export default QRScanner;
