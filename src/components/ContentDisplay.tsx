import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  Brain, 
  Egg, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface ContentItem {
  id: string;
  type: 'hint' | 'riddle' | 'easter_egg';
  title: string;
  content: string;
  answer?: string;
  solved?: boolean;
  found?: boolean;
}

interface ContentDisplayProps {
  content: ContentItem | null;
  onSolveRiddle: (id: string) => void;
  onMarkFound: (id: string) => void;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ 
  content, 
  onSolveRiddle, 
  onMarkFound 
}) => {
  const [answer, setAnswer] = useState('');
  const [showingAnswer, setShowingAnswer] = useState(false);

  if (!content) {
    return (
      <Card className="p-8 text-center holo-border">
        <div className="space-y-4">
          <Eye className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="text-xl font-bold">Esperando Código QR</h3>
          <p className="text-muted-foreground">
            Escanea un código QR para ver el contenido aquí
          </p>
        </div>
      </Card>
    );
  }

  const handleSubmitAnswer = () => {
    if (!content.answer || !answer.trim()) return;

    if (answer.toLowerCase().trim() === content.answer.toLowerCase().trim()) {
      setShowingAnswer(true);
      onSolveRiddle(content.id);
      toast({
        title: "¡Correcto!",
        description: "Has resuelto el acertijo exitosamente",
      });
    } else {
      toast({
        title: "Respuesta Incorrecta",
        description: "Intenta nuevamente",
        variant: "destructive",
      });
      setAnswer('');
    }
  };

  const handleMarkAsFound = () => {
    onMarkFound(content.id);
    toast({
      title: "¡Descubierto!",
      description: `${content.type === 'easter_egg' ? 'Huevo de pascua' : 'Pista'} añadido a tu colección`,
    });
  };

  const getIcon = () => {
    switch (content.type) {
      case 'hint':
        return <Lightbulb className="h-8 w-8 text-neon-cyan" />;
      case 'riddle':
        return <Brain className="h-8 w-8 text-neon-purple" />;
      case 'easter_egg':
        return <Egg className="h-8 w-8 text-neon-pink" />;
    }
  };

  const getTypeLabel = () => {
    switch (content.type) {
      case 'hint':
        return 'Pista';
      case 'riddle':
        return 'Acertijo';
      case 'easter_egg':
        return 'Huevo de Pascua';
    }
  };

  const getTypeColor = () => {
    switch (content.type) {
      case 'hint':
        return 'bg-neon-cyan';
      case 'riddle':
        return 'bg-neon-purple';
      case 'easter_egg':
        return 'bg-neon-pink';
    }
  };

  return (
    <Card className="p-6 holo-border">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div>
              <Badge className={`${getTypeColor()} text-black font-bold`}>
                {getTypeLabel()}
              </Badge>
              <h2 className="text-2xl font-bold mt-1">{content.title}</h2>
            </div>
          </div>
          
          {content.solved && (
            <CheckCircle className="h-8 w-8 text-neon-green glitch-effect" data-text="✓" />
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg border-l-4 border-neon-cyan">
            <p className="text-lg leading-relaxed">{content.content}</p>
          </div>

          {/* Riddle Object Finding Section */}
          {content.type === 'riddle' && !content.solved && (
            <div className="space-y-4">
              <div className="p-4 bg-neon-purple/10 border border-neon-purple rounded-lg text-center">
                <Brain className="mx-auto h-8 w-8 text-neon-purple mb-2" />
                <p className="text-lg font-semibold text-neon-purple">
                  Escanea el QR del objeto que encontraste
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Busca el objeto en la habitación y escanea su código QR para resolver el acertijo
                </p>
              </div>
            </div>
          )}

          {/* Solved Riddle Display */}
          {content.type === 'riddle' && content.solved && (
            <div className="p-4 bg-neon-green/10 border border-neon-green rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-neon-green" />
                <span className="font-semibold text-neon-green">¡Resuelto!</span>
              </div>
              <p className="mt-2 text-sm">Respuesta correcta: <span className="font-bold">{content.answer}</span></p>
            </div>
          )}

          {/* Action Buttons for Hints and Easter Eggs */}
          {(content.type === 'hint' || content.type === 'easter_egg') && !content.found && (
            <Button 
              onClick={handleMarkAsFound}
              className="w-full neon-glow"
              variant="secondary"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Añadir a mi Colección
            </Button>
          )}

          {(content.type === 'hint' || content.type === 'easter_egg') && content.found && (
            <div className="p-4 bg-neon-cyan/10 border border-neon-cyan rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-neon-cyan" />
                <span className="font-semibold text-neon-cyan">
                  {content.type === 'easter_egg' ? '¡Huevo de Pascua Encontrado!' : '¡Pista Obtenida!'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};