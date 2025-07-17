import { useState, useEffect } from 'react';
import { ContentItem } from '@/components/ContentDisplay';
import gameData from '@/data/gameData.json';

// Base de datos de contenido QR cargada desde JSON
const QR_DATABASE: Record<string, ContentItem> = {};

// Cargar datos del JSON
[...gameData.hints, ...gameData.riddles, ...gameData.easterEggs].forEach(item => {
  QR_DATABASE[item.id] = item as ContentItem;
});

// Mapeo de códigos QR a contenido cargado desde JSON
const QR_MAPPINGS: Record<string, string> = gameData.qrMappings;

const STORAGE_KEY = 'escape-room-progress';

export const useGameState = () => {
  const [discoveredContent, setDiscoveredContent] = useState<ContentItem[]>([]);
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);

  // Cargar progreso guardado al inicializar
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setDiscoveredContent(parsed.discoveredContent || []);
        setCurrentContent(parsed.currentContent || null);
        setIsGameStarted(parsed.isGameStarted || false);
        setGameTime(parsed.gameTime || 0);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Guardar progreso cuando cambie el estado
  useEffect(() => {
    const progress = {
      discoveredContent,
      currentContent,
      isGameStarted,
      gameTime
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [discoveredContent, currentContent, isGameStarted, gameTime]);

  const processQRCode = (qrData: string): ContentItem | null => {
    // Normalizar el código QR
    const normalizedQR = qrData.trim();
    
    // Buscar el ID del contenido
    const contentId = QR_MAPPINGS[normalizedQR];
    if (!contentId) {
      return null;
    }

    // Obtener el contenido de la base de datos
    const content = QR_DATABASE[contentId];
    if (!content) {
      return null;
    }

    // Verificar si ya está descubierto
    const existingContent = discoveredContent.find(item => item.id === content.id);
    if (existingContent) {
      setCurrentContent(existingContent);
      return existingContent;
    }

    // Agregar nuevo contenido descubierto
    const newContent = { ...content };
    setDiscoveredContent(prev => [...prev, newContent]);
    setCurrentContent(newContent);
    
    return newContent;
  };

  const solveRiddle = (riddleId: string) => {
    setDiscoveredContent(prev =>
      prev.map(item =>
        item.id === riddleId && item.type === 'riddle'
          ? { ...item, solved: true }
          : item
      )
    );
    
    if (currentContent?.id === riddleId) {
      setCurrentContent(prev => prev ? { ...prev, solved: true } : null);
    }
  };

  const markAsFound = (itemId: string) => {
    setDiscoveredContent(prev =>
      prev.map(item =>
        item.id === itemId && (item.type === 'hint' || item.type === 'easter_egg')
          ? { ...item, found: true }
          : item
      )
    );
    
    if (currentContent?.id === itemId) {
      setCurrentContent(prev => prev ? { ...prev, found: true } : null);
    }
  };

  const selectContent = (content: ContentItem) => {
    setCurrentContent(content);
  };

  const startGame = () => {
    setIsGameStarted(true);
    setGameTime(0);
  };

  const resetGame = () => {
    setDiscoveredContent([]);
    setCurrentContent(null);
    setIsGameStarted(false);
    setGameTime(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    discoveredContent,
    currentContent,
    isGameStarted,
    gameTime,
    processQRCode,
    solveRiddle,
    markAsFound,
    selectContent,
    startGame,
    resetGame
  };
};