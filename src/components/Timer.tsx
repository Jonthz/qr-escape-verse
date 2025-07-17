import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  isGameStarted: boolean;
  onTimeUpdate?: (timeElapsed: number) => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ 
  isGameStarted, 
  onTimeUpdate,
  className = "" 
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isGameStarted && !isRunning) {
      setIsRunning(true);
    } else if (!isGameStarted) {
      setIsRunning(false);
      setTimeElapsed(0);
    }
  }, [isGameStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!isGameStarted) return 'text-muted-foreground';
    if (timeElapsed < 1800) return 'text-neon-green'; // < 30 min
    if (timeElapsed < 3600) return 'text-neon-orange'; // < 60 min
    return 'text-neon-red'; // > 60 min
  };

  const getStatusBadge = () => {
    if (!isGameStarted) return 'Esperando Inicio';
    if (isRunning) return 'En Progreso';
    return 'Pausado';
  };

  const getStatusColor = () => {
    if (!isGameStarted) return 'bg-muted';
    if (isRunning) return 'bg-neon-green';
    return 'bg-neon-orange';
  };

  return (
    <Card className={`p-4 holo-border ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className={`h-6 w-6 ${getTimerColor()}`} />
          <div>
            <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
              {formatTime(timeElapsed)}
            </div>
            <Badge className={`${getStatusColor()} text-black text-xs mt-1`}>
              {getStatusBadge()}
            </Badge>
          </div>
        </div>
        
        {isGameStarted && (
          <div className="flex items-center space-x-2">
            {isRunning ? (
              <Pause className="h-4 w-4 text-neon-orange" />
            ) : (
              <Play className="h-4 w-4 text-neon-green" />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};