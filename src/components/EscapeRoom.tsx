import React, { useState } from 'react';
import { QRScanner } from './QRScanner';
import { ContentDisplay } from './ContentDisplay';
import { NavigationMenu } from './NavigationMenu';
import { QRTestCodes } from './QRTestCodes';
import { Timer } from './Timer';
import { FinalPasswordPanel } from './FinalPasswordPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGameState } from '@/hooks/useGameState';
import { toast } from '@/hooks/use-toast';
import { 
  Menu, 
  X, 
  RotateCcw, 
  Zap,
  Shield,
  Cpu
} from 'lucide-react';

export const EscapeRoom: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [finalDoorUnlocked, setFinalDoorUnlocked] = useState(false);
  const {
    discoveredContent,
    currentContent,
    isGameStarted,
    gameTime,
    processQRCode,
    solveRiddle,
    markAsFound,
    selectContent,
    resetGame
  } = useGameState();

  const handleQRScan = (qrData: string) => {
    const content = processQRCode(qrData);
    
    if (content) {
      toast({
        title: `${content.type === 'hint' ? 'Pista' : content.type === 'riddle' ? 'Acertijo' : 'Huevo de Pascua'} Encontrado!`,
        description: content.title,
      });
      setShowMenu(false); // Cerrar menú al encontrar contenido
    } else {
      toast({
        title: "Código QR No Reconocido",
        description: "Este código no pertenece al escape room",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    resetGame();
    setFinalDoorUnlocked(false);
    toast({
      title: "Juego Reiniciado",
      description: "Tu progreso ha sido borrado",
    });
  };

  const handleFinalUnlock = () => {
    setFinalDoorUnlocked(true);
  };

  // Determinar si mostrar el panel de contraseña final
  const shouldShowPasswordPanel = discoveredContent.length >= 3; // Ajusta esta condición según tu lógica

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-neon-cyan" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text"
                style={{backgroundImage: 'var(--gradient-primary)'}}>
              QR Escape Verse
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="relative"
            >
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              {discoveredContent.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-neon-orange rounded-full" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Timer Display */}
            <Timer 
              isGameStarted={isGameStarted}
              onTimeUpdate={(time) => {}}
            />
            {/* Welcome Card - Only show if no content discovered */}
            {discoveredContent.length === 0 && !currentContent && (
              <Card className="p-8 text-center holo-border">
                <div className="space-y-6">
                  <div className="mx-auto h-20 w-20 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                    <Cpu className="h-10 w-10 text-black" />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text"
                        style={{backgroundImage: 'var(--gradient-primary)'}}>
                      Bienvenido al QR Escape Verse
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Adéntrate en un mundo futurista donde los códigos QR guardan secretos, 
                      acertijos y sorpresas. Escanea, resuelve y descubre todos los misterios 
                      que te esperan en este escape room digital.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 bg-muted rounded-lg holo-border">
                      <div className="text-neon-cyan text-2xl font-bold mb-2">🔍</div>
                      <h3 className="font-semibold text-neon-cyan">Escanea</h3>
                      <p className="text-sm text-muted-foreground">
                        Usa tu cámara o sube imágenes de códigos QR
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg holo-border">
                      <div className="text-neon-purple text-2xl font-bold mb-2">🧩</div>
                      <h3 className="font-semibold text-neon-purple">Resuelve</h3>
                      <p className="text-sm text-muted-foreground">
                        Completa acertijos y encuentra pistas ocultas
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg holo-border">
                      <div className="text-neon-pink text-2xl font-bold mb-2">🏆</div>
                      <h3 className="font-semibold text-neon-pink">Descubre</h3>
                      <p className="text-sm text-muted-foreground">
                        Encuentra huevos de pascua y secretos especiales
                      </p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Zap className="inline h-5 w-5 text-neon-orange mr-2" />
                    <span className="text-sm text-muted-foreground">
                      ¡Comienza escaneando tu primer código QR para iniciar la aventura!
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* QR Scanner */}
            <QRScanner onScanResult={handleQRScan} />
            
            {/* QR Test Codes - Only show if no content discovered */}
            {discoveredContent.length === 0 && (
              <QRTestCodes onTestCode={handleQRScan} />
            )}
            
            {/* Content Display */}
            <ContentDisplay
              content={currentContent}
              onSolveRiddle={solveRiddle}
              onMarkFound={markAsFound}
            />

            {/* Final Password Panel */}
            <FinalPasswordPanel
              isVisible={shouldShowPasswordPanel}
              isUnlocked={finalDoorUnlocked}
              onUnlock={handleFinalUnlock}
            />
          </div>

          {/* Navigation Menu - Desktop */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24">
              <NavigationMenu
                content={discoveredContent}
                onSelectContent={selectContent}
                selectedContent={currentContent}
              />
            </div>
          </div>

          {/* Navigation Menu - Mobile Overlay */}
          {showMenu && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
              <div className="absolute top-16 left-0 right-0 bottom-0 overflow-y-auto">
                <div className="container mx-auto px-4 py-6">
                  <NavigationMenu
                    content={discoveredContent}
                    onSelectContent={(content) => {
                      selectContent(content);
                      setShowMenu(false);
                    }}
                    selectedContent={currentContent}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Testing QR Codes Helper - Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-40">
          <Card className="p-4 bg-muted/50 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground mb-2">QR Codes de prueba:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {['pista1', 'acertijo1', 'huevo1'].map(code => (
                <Button
                  key={code}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQRScan(code)}
                  className="h-6 px-2 text-xs"
                >
                  {code}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};