import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer } from '@/components/Timer';
import { useGameState } from '@/hooks/useGameState';
import { 
  Play, 
  RotateCcw, 
  Shield, 
  Users, 
  Trophy,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Admin() {
  const {
    discoveredContent,
    isGameStarted,
    gameTime,
    startGame,
    resetGame
  } = useGameState();

  const handleStartGame = () => {
    startGame();
    toast({
      title: "🚀 ¡Juego Iniciado!",
      description: "El escape room ha comenzado. El temporizador está corriendo.",
    });
  };

  const handleResetGame = () => {
    resetGame();
    toast({
      title: "🔄 Juego Reiniciado",
      description: "Todo el progreso ha sido borrado y el temporizador reiniciado.",
    });
  };

  const getStats = () => {
    const hints = discoveredContent.filter(item => item.type === 'hint');
    const riddles = discoveredContent.filter(item => item.type === 'riddle');
    const easterEggs = discoveredContent.filter(item => item.type === 'easter_egg');
    
    return {
      totalFound: discoveredContent.length,
      hintsFound: hints.filter(h => h.found).length,
      riddlesSolved: riddles.filter(r => r.solved).length,
      eggsFound: easterEggs.filter(e => e.found).length,
      totalHints: hints.length,
      totalRiddles: riddles.length,
      totalEggs: easterEggs.length
    };
  };

  const stats = getStats();
  const completionPercentage = stats.totalFound > 0 ? 
    Math.round(((stats.hintsFound + stats.riddlesSolved + stats.eggsFound) / (stats.totalHints + stats.totalRiddles + stats.totalEggs)) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-neon-cyan" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text"
                style={{backgroundImage: 'var(--gradient-primary)'}}>
              Panel de Administrador
            </h1>
          </div>
          
          <Badge className="bg-neon-red text-black px-3 py-1">
            <Shield className="mr-1 h-3 w-3" />
            ADMIN ONLY
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Game Controls */}
          <Card className="p-6 holo-border">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-neon-orange" />
                <h2 className="text-xl font-bold">Control del Juego</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-semibold">Estado del Juego</p>
                    <p className="text-sm text-muted-foreground">
                      {isGameStarted ? 'Juego en progreso' : 'Esperando inicio'}
                    </p>
                  </div>
                  <Badge className={isGameStarted ? 'bg-neon-green text-black' : 'bg-muted'}>
                    {isGameStarted ? 'ACTIVO' : 'INACTIVO'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleStartGame}
                    disabled={isGameStarted}
                    className="neon-glow bg-neon-green hover:bg-neon-green/80 text-black"
                    size="lg"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isGameStarted ? 'Juego Iniciado' : 'Iniciar Juego'}
                  </Button>

                  <Button
                    onClick={handleResetGame}
                    variant="destructive"
                    className="neon-glow"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Completo
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Timer Display */}
          <Timer 
            isGameStarted={isGameStarted}
            onTimeUpdate={(time) => {}}
            className=""
          />

          {/* Game Statistics */}
          <Card className="p-6 holo-border lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-neon-orange" />
                  <h2 className="text-xl font-bold">Estadísticas del Juego</h2>
                </div>
                <Badge className="bg-neon-cyan text-black px-3 py-1">
                  {completionPercentage}% Completado
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg holo-border">
                  <div className="text-2xl font-bold text-neon-purple">
                    {stats.riddlesSolved}/{stats.totalRiddles}
                  </div>
                  <div className="text-sm text-muted-foreground">Acertijos Resueltos</div>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg holo-border">
                  <div className="text-2xl font-bold text-neon-cyan">
                    {stats.hintsFound}/{stats.totalHints}
                  </div>
                  <div className="text-sm text-muted-foreground">Pistas Encontradas</div>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg holo-border">
                  <div className="text-2xl font-bold text-neon-pink">
                    {stats.eggsFound}/{stats.totalEggs}
                  </div>
                  <div className="text-sm text-muted-foreground">Huevos de Pascua</div>
                </div>

                <div className="text-center p-4 bg-muted rounded-lg holo-border">
                  <div className="text-2xl font-bold text-neon-green">
                    {stats.totalFound}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Descubierto</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 holo-border lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-neon-cyan" />
                <h2 className="text-xl font-bold">Instrucciones para el Administrador</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-neon-green">Inicio del Juego</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Presiona "Iniciar Juego" para comenzar la sesión</li>
                    <li>• Esto activará el temporizador automáticamente</li>
                    <li>• Los jugadores podrán comenzar a escanear códigos QR</li>
                    <li>• El botón se deshabilitará una vez iniciado</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-neon-red">Reset del Juego</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• "Reset Completo" borra todo el progreso</li>
                    <li>• Reinicia el temporizador a 00:00</li>
                    <li>• Limpia todas las pistas y acertijos resueltos</li>
                    <li>• Regresa el juego al estado inicial</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-neon-orange/10 border border-neon-orange rounded-lg">
                <p className="text-sm text-neon-orange font-semibold">
                  ⚠️ Advertencia: Esta página debe mantenerse oculta de los jugadores durante el escape room.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}