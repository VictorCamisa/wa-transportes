
import React, { useState, useEffect } from 'react';
import { removeBackground } from '@/utils/backgroundRemoval';

interface BackgroundRemovedLogoProps {
  originalSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

const BackgroundRemovedLogo: React.FC<BackgroundRemovedLogoProps> = ({ 
  originalSrc, 
  alt, 
  className = "",
  style = {}
}) => {
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      setIsProcessing(true);
      setError(null);
      
      try {
        console.log('Carregando imagem para remoção de fundo...');
        
        // Fetch the original image
        const response = await fetch(originalSrc);
        const blob = await response.blob();
        
        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
        
        img.src = URL.createObjectURL(blob);
        const loadedImage = await imageLoadPromise;
        
        console.log('Imagem carregada, removendo fundo...');
        
        // Remove background
        const processedBlob = await removeBackground(loadedImage);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setProcessedImageUrl(processedUrl);
        console.log('Fundo removido com sucesso!');
        
      } catch (err) {
        console.error('Erro ao processar imagem:', err);
        setError('Erro ao processar a imagem');
      } finally {
        setIsProcessing(false);
      }
    };

    processImage();

    // Cleanup function
    return () => {
      if (processedImageUrl) {
        URL.revokeObjectURL(processedImageUrl);
      }
    };
  }, [originalSrc]);

  if (isProcessing) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={style}>
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <img 
        src={originalSrc} 
        alt={alt} 
        className={className}
        style={style}
      />
    );
  }

  return (
    <img 
      src={processedImageUrl || originalSrc} 
      alt={alt} 
      className={className}
      style={style}
    />
  );
};

export default BackgroundRemovedLogo;
