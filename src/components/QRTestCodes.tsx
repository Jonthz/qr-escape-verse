import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface QRTestCodesProps {
  onTestCode: (code: string) => void;
}

const TEST_CODES = [
  // Pistas
  { code: 'pista1', type: 'Pista', title: 'El Primer Paso', color: 'bg-neon-cyan' },
  { code: 'pista2', type: 'Pista', title: 'Los Números Hablan', color: 'bg-neon-cyan' },
  { code: 'pista3', type: 'Pista', title: 'Reflejo de la Verdad', color: 'bg-neon-cyan' },
  
  // Acertijos  
  { code: 'acertijo1', type: 'Acertijo', title: 'El Enigma del Tiempo', color: 'bg-neon-purple' },
  { code: 'acertijo2', type: 'Acertijo', title: 'La Habitación Secreta', color: 'bg-neon-purple' },
  { code: 'acertijo3', type: 'Acertijo', title: 'El Código del Futuro', color: 'bg-neon-purple' },
  
  // Huevos de Pascua
  { code: 'huevo1', type: 'Huevo', title: 'El Desarrollador Secreto', color: 'bg-neon-pink' },
  { code: 'huevo2', type: 'Huevo', title: 'El Gato de Schrödinger', color: 'bg-neon-pink' },
  { code: 'huevo3', type: 'Huevo', title: 'La Fórmula de la Diversión', color: 'bg-neon-pink' },
  { code: 'huevo4', type: 'Huevo', title: 'El Mensaje del Futuro', color: 'bg-neon-pink' },
];

export const QRTestCodes: React.FC<QRTestCodesProps> = ({ onTestCode }) => {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código Copiado",
      description: `"${code}" copiado al portapapeles`,
    });
  };

  const generateQRCodeURL = (code: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(code)}`;
  };

  const downloadQR = (code: string, title: string) => {
    const url = generateQRCodeURL(code);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-${code}-${title.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Descargado",
      description: `Código QR para "${title}" descargado`,
    });
  };

  return (
    <Card className="p-6 holo-border">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-bold text-transparent bg-clip-text"
              style={{backgroundImage: 'var(--gradient-primary)'}}>
            Códigos QR de Prueba
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Usa estos códigos para probar el escape room
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEST_CODES.map((item) => (
            <div key={item.code} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className={`${item.color} text-black text-xs`}>
                  {item.type}
                </Badge>
              </div>
              
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs font-mono text-muted-foreground">{item.code}</p>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTestCode(item.code)}
                    className="flex-1 h-8 text-xs"
                  >
                    Probar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.code)}
                    className="h-8 px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadQR(item.code, item.title)}
                    className="h-8 px-2"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Instrucciones:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Probar:</strong> Simula escanear el código directamente</li>
            <li>• <strong>Copiar:</strong> Copia el código para generar tu propio QR</li>
            <li>• <strong>Descargar:</strong> Descarga el código QR como imagen</li>
            <li>• Puedes imprimir los códigos QR descargados para una experiencia real</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};