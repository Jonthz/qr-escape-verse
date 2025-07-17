import { useState, useEffect } from 'react';
import { ContentItem } from '@/components/ContentDisplay';

// Base de datos simulada de contenido QR
const QR_DATABASE: Record<string, ContentItem> = {
  // Pistas
  'pista1': {
    id: 'pista1',
    type: 'hint',
    title: 'El Primer Paso',
    content: 'Las respuestas no siempre están donde las buscas. A veces, hay que mirar hacia arriba para encontrar lo que está abajo. La entrada principal guarda más secretos de los que imaginas.',
    found: false
  },
  'pista2': {
    id: 'pista2',
    type: 'hint',
    title: 'Los Números Hablan',
    content: 'Cuando encuentres la secuencia 4-8-15-16-23-42, recuerda que cada número tiene su lugar en el universo. La suma de sus dígitos te dará la clave para el siguiente nivel.',
    found: false
  },
  'pista3': {
    id: 'pista3',
    type: 'hint',
    title: 'Reflejo de la Verdad',
    content: 'Los espejos no mienten, pero a veces muestran más de lo que esperamos. Si ves tu reflejo fragmentado, sigue las líneas que se rompen hacia el corazón del laberinto.',
    found: false
  },

  // Acertijos
  'acertijo1': {
    id: 'acertijo1',
    type: 'riddle',
    title: 'El Enigma del Tiempo',
    content: 'Tengo manecillas pero no manos, tengo números pero no puedo contar, marco el tiempo pero no envejezco. Cuando mis manecillas se encuentran en el 12, ¿qué palabra se forma si lees las primeras letras de esta descripción?',
    answer: 'reloj',
    solved: false
  },
  'acertijo2': {
    id: 'acertijo2',
    type: 'riddle',
    title: 'La Habitación Secreta',
    content: 'En una habitación hay 4 esquinas. En cada esquina hay un gato. Cada gato ve 3 gatos. ¿Cuántos gatos hay en total? La respuesta numérica es la clave.',
    answer: '4',
    solved: false
  },
  'acertijo3': {
    id: 'acertijo3',
    type: 'riddle',
    title: 'El Código del Futuro',
    content: 'Si ESCAPE = 573125 y ROOM = 9662, ¿cuál es el valor de FREEDOM? (Pista: A=1, B=2, C=3... pero hay un patrón oculto en los números)',
    answer: '6955562',
    solved: false
  },

  // Huevos de Pascua
  'huevo1': {
    id: 'huevo1',
    type: 'easter_egg',
    title: '¡El Desarrollador Secreto!',
    content: '🎉 ¡Felicidades! Has encontrado el primer huevo de pascua. Este escape room fue creado con mucho cariño y líneas de código. ¿Sabías que el código QR es en realidad una matriz bidimensional de información? ¡Ahora eres parte del club secreto de los exploradores de códigos!',
    found: false
  },
  'huevo2': {
    id: 'huevo2',
    type: 'easter_egg',
    title: 'El Gato de Schrödinger',
    content: '🐱 ¡Has descubierto el gato cuántico! En el mundo de la programación, a veces los bugs existen y no existen al mismo tiempo, hasta que alguien los observa. Este gato está definitivamente vivo y celebrando tu curiosidad. ¡Miau-nificent work!',
    found: false
  },
  'huevo3': {
    id: 'huevo3',
    type: 'easter_egg',
    title: 'La Fórmula de la Diversión',
    content: '⚡ ¡Fórmula encontrada! DIVERSIÓN = (CURIOSIDAD × PERSEVERANCIA) + CÓDIGOS_QR. Has demostrado tener la ecuación perfecta para resolver cualquier misterio. Este huevo de pascua te otorga poderes especiales... bueno, al menos una sonrisa.',
    found: false
  },
  'huevo4': {
    id: 'huevo4',
    type: 'easter_egg',
    title: 'El Mensaje del Futuro',
    content: '🚀 ¡Transmisión desde el año 3023! Los escape rooms evolucionaron hasta convertirse en realidades paralelas. Tu habilidad para resolver este acertijo del siglo XXI te convierte en un candidato perfecto para nuestras aventuras temporales. ¡Mantén este mensaje en secreto!',
    found: false
  }
};

// Mapeo de códigos QR a contenido (simulando diferentes formatos de QR)
const QR_MAPPINGS: Record<string, string> = {
  // URLs que podrían estar en códigos QR reales
  'https://escape.room/pista/1': 'pista1',
  'https://escape.room/pista/2': 'pista2',  
  'https://escape.room/pista/3': 'pista3',
  'https://escape.room/acertijo/1': 'acertijo1',
  'https://escape.room/acertijo/2': 'acertijo2',
  'https://escape.room/acertijo/3': 'acertijo3',
  'https://escape.room/huevo/1': 'huevo1',
  'https://escape.room/huevo/2': 'huevo2',
  'https://escape.room/huevo/3': 'huevo3',
  'https://escape.room/huevo/4': 'huevo4',
  
  // Códigos simples para testing
  'pista1': 'pista1',
  'pista2': 'pista2',
  'pista3': 'pista3',
  'acertijo1': 'acertijo1',
  'acertijo2': 'acertijo2',
  'acertijo3': 'acertijo3',
  'huevo1': 'huevo1',
  'huevo2': 'huevo2',
  'huevo3': 'huevo3',
  'huevo4': 'huevo4',
  
  // Números para códigos QR numéricos
  '1001': 'pista1',
  '1002': 'pista2',
  '1003': 'pista3',
  '2001': 'acertijo1',
  '2002': 'acertijo2',
  '2003': 'acertijo3',
  '3001': 'huevo1',
  '3002': 'huevo2',
  '3003': 'huevo3',
  '3004': 'huevo4'
};

const STORAGE_KEY = 'escape-room-progress';

export const useGameState = () => {
  const [discoveredContent, setDiscoveredContent] = useState<ContentItem[]>([]);
  const [currentContent, setCurrentContent] = useState<ContentItem | null>(null);

  // Cargar progreso guardado al inicializar
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setDiscoveredContent(parsed.discoveredContent || []);
        setCurrentContent(parsed.currentContent || null);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Guardar progreso cuando cambie el estado
  useEffect(() => {
    const progress = {
      discoveredContent,
      currentContent
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [discoveredContent, currentContent]);

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

  const resetGame = () => {
    setDiscoveredContent([]);
    setCurrentContent(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    discoveredContent,
    currentContent,
    processQRCode,
    solveRiddle,
    markAsFound,
    selectContent,
    resetGame
  };
};