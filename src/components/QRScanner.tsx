import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { Camera, Upload, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface QRScannerProps {
  onScanResult: (result: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if camera is available
    QrScanner.hasCamera().then(setHasCamera);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = async () => {
    if (!videoRef.current) return;

    try {
      setIsScanning(true);
      
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          onScanResult(result.data);
          stopScanning();
          toast({
            title: "QR Código Escaneado",
            description: "Procesando código...",
          });
        },
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
    } catch (error) {
      console.error('Error starting scanner:', error);
      setIsScanning(false);
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara",
        variant: "destructive",
      });
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      onScanResult(result);
      toast({
        title: "QR Código Detectado",
        description: "Procesando código desde imagen...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo detectar un código QR en la imagen",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 holo-border">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Scan className="mx-auto h-12 w-12 text-neon-cyan" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text" 
              style={{backgroundImage: 'var(--gradient-primary)'}}>
            Escáner QR
          </h2>
          <p className="text-muted-foreground">
            Escanea un código QR para descubrir pistas, acertijos o huevos de pascua
          </p>
        </div>

        {/* Video preview for camera scanning */}
        <div className="relative mx-auto max-w-sm">
          <video
            ref={videoRef}
            className={`w-full h-64 bg-muted rounded-lg ${
              isScanning ? 'pulse-scan' : ''
            }`}
            style={{ display: isScanning ? 'block' : 'none' }}
          />
          
          {!isScanning && (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center scanning-line">
              <div className="text-center">
                <Camera className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Vista previa de cámara</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {hasCamera && (
            <Button
              onClick={isScanning ? stopScanning : startScanning}
              variant={isScanning ? "destructive" : "default"}
              className="neon-glow"
            >
              <Camera className="mr-2 h-4 w-4" />
              {isScanning ? 'Detener Escáner' : 'Escanear con Cámara'}
            </Button>
          )}

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="neon-glow"
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir Imagen
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {!hasCamera && (
          <p className="text-sm text-muted-foreground">
            Cámara no disponible. Usa la opción de subir imagen.
          </p>
        )}
      </div>
    </Card>
  );
};