import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { KeyRound, Lock, Unlock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FinalPasswordPanelProps {
  isVisible: boolean;
  isUnlocked: boolean;
  onUnlock: () => void;
}

export const FinalPasswordPanel: React.FC<FinalPasswordPanelProps> = ({
  isVisible,
  isUnlocked,
  onUnlock
}) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const correctPassword = "ESCAPE2024"; // Puedes cambiar esta contraseña

  if (!isVisible) return null;

  const handleSubmitPassword = () => {
    if (password.toUpperCase() === correctPassword) {
      onUnlock();
      toast({
        title: "🎉 ¡ESCAPE ROOM COMPLETADO!",
        description: "Has ingresado la contraseña correcta. ¡La puerta está abierta!",
      });
    } else {
      setAttempts(prev => prev + 1);
      toast({
        title: "Contraseña Incorrecta",
        description: `Intento ${attempts + 1}. Verifica la contraseña e intenta nuevamente.`,
        variant: "destructive",
      });
      setPassword('');
    }
  };

  if (isUnlocked) {
    return (
      <Card className="p-6 holo-border border-neon-green">
        <div className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-neon-green to-neon-cyan rounded-full flex items-center justify-center">
            <Unlock className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-neon-green glitch-effect" data-text="¡ESCAPE COMPLETADO!">
            ¡ESCAPE COMPLETADO!
          </h2>
          <p className="text-lg text-muted-foreground">
            🎊 ¡Felicidades! Has resuelto todos los desafíos y abierto la puerta del escape room.
          </p>
          <Badge className="bg-neon-green text-black px-4 py-2 text-base">
            <CheckCircle className="mr-2 h-4 w-4" />
            MISIÓN CUMPLIDA
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 holo-border border-neon-orange">
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-neon-orange to-neon-red rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text"
              style={{backgroundImage: 'var(--gradient-primary)'}}>
            Contraseña Final
          </h2>
          <p className="text-muted-foreground mt-2">
            Ingresa la contraseña final para abrir la puerta del escape room
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Contraseña final..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitPassword()}
                className="pl-10 bg-input border-border text-foreground font-mono tracking-wider"
              />
            </div>
            <Button 
              onClick={handleSubmitPassword}
              disabled={!password.trim()}
              className="neon-glow bg-neon-orange hover:bg-neon-orange/80 text-black"
            >
              <Unlock className="mr-2 h-4 w-4" />
              Abrir
            </Button>
          </div>

          {attempts > 0 && (
            <div className="text-center">
              <Badge variant="outline" className="text-neon-red border-neon-red">
                Intentos fallidos: {attempts}
              </Badge>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>💡 La contraseña debe obtenerse resolviendo todos los acertijos</p>
            <p>🔑 Combina las pistas encontradas para formar la palabra clave</p>
          </div>
        </div>
      </div>
    </Card>
  );
};