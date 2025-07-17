import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Brain, 
  Egg, 
  CheckCircle, 
  Lock,
  Trophy,
  Target,
  Sparkles
} from 'lucide-react';
import { ContentItem } from './ContentDisplay';

interface NavigationMenuProps {
  content: ContentItem[];
  onSelectContent: (content: ContentItem) => void;
  selectedContent: ContentItem | null;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  content, 
  onSelectContent, 
  selectedContent 
}) => {
  const hints = content.filter(item => item.type === 'hint');
  const riddles = content.filter(item => item.type === 'riddle');
  const easterEggs = content.filter(item => item.type === 'easter_egg');

  const getStats = () => {
    const solvedRiddles = riddles.filter(r => r.solved).length;
    const foundHints = hints.filter(h => h.found).length;
    const foundEggs = easterEggs.filter(e => e.found).length;
    
    return {
      riddles: `${solvedRiddles}/${riddles.length}`,
      hints: `${foundHints}/${hints.length}`,
      eggs: `${foundEggs}/${easterEggs.length}`,
      total: solvedRiddles + foundHints + foundEggs
    };
  };

  const stats = getStats();

  const renderSection = (
    items: ContentItem[], 
    title: string, 
    icon: React.ReactNode, 
    emptyMessage: string,
    completionKey: 'solved' | 'found'
  ) => (
    <Card className="p-4 holo-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          {items.filter(item => item[completionKey]).length}/{items.length}
        </Badge>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Lock className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p className="text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Button
              key={item.id}
              variant={selectedContent?.id === item.id ? "default" : "ghost"}
              onClick={() => onSelectContent(item)}
              className="w-full justify-between text-left h-auto p-3 neon-glow"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {item[completionKey] ? (
                    <CheckCircle className="h-5 w-5 text-neon-green" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  )}
                </div>
                <div className="text-left">
                  <p className={`font-medium ${
                    item[completionKey] ? 'text-neon-green glitch-effect' : ''
                  }`} data-text={item.title}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item[completionKey] ? 
                      (completionKey === 'solved' ? 'Resuelto' : 'Encontrado') : 
                      'Pendiente'
                    }
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="p-6 holo-border">
        <div className="text-center space-y-4">
          <Trophy className="mx-auto h-12 w-12 text-neon-orange" />
          <h2 className="text-2xl font-bold text-transparent bg-clip-text"
              style={{backgroundImage: 'var(--gradient-accent)'}}>
            Progreso del Escape Room
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-purple">{stats.riddles}</div>
              <div className="text-xs text-muted-foreground">Acertijos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-cyan">{stats.hints}</div>
              <div className="text-xs text-muted-foreground">Pistas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-pink">{stats.eggs}</div>
              <div className="text-xs text-muted-foreground">Huevos</div>
            </div>
          </div>

          <div className="mt-4">
            <Badge className="bg-neon-green text-black px-3 py-1">
              <Target className="mr-1 h-3 w-3" />
              Total Completado: {stats.total}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Sections */}
      {renderSection(
        riddles,
        'Acertijos',
        <Brain className="h-5 w-5 text-neon-purple" />,
        'No hay acertijos disponibles aún. ¡Escanea códigos QR para encontrarlos!',
        'solved'
      )}

      {renderSection(
        hints,
        'Pistas para Alpha',
        <Lightbulb className="h-5 w-5 text-neon-cyan" />,
        'No hay pistas disponibles aún. ¡Explora para encontrarlas!',
        'found'
      )}

      {renderSection(
        easterEggs,
        'Huevos de Pascua',
        <Egg className="h-5 w-5 text-neon-pink" />,
        'No has encontrado huevos de pascua aún. ¡Sigue buscando!',
        'found'
      )}
    </div>
  );
};