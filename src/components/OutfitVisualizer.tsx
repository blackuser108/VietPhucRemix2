import React from 'react';
import { CostumeItem, ClothingPiece, ColorOption } from '../data/costumesData';
import { LayeredAvatarEngine, AvatarGender } from './LayeredAvatarEngine';

export interface OutfitVisualizerProps {
  gender?: AvatarGender;
  costume: CostumeItem;
  color: ColorOption;
  bottom: ClothingPiece;
  footwear: ClothingPiece;
  accessories: ClothingPiece[];
  styleMode?: 'traditional' | 'light_modern' | 'genz_streetwear';
  cameraZoom?: 'full' | 'upper' | 'lower';
  compactStage?: boolean;
  // Dynamic outfit image attributes
  currentOutfitImage?: string | null;
  isGenerating?: boolean;
  generationStatus?: string;
  isFailed?: boolean;
  errorMessage?: string;
  isCached?: boolean;
  outfitKey?: string;
  imageSourceText?: string;
  onRetry?: () => void;
}

export const OutfitVisualizer: React.FC<OutfitVisualizerProps> = ({
  gender = 'female',
  costume,
  color,
  bottom,
  footwear,
  accessories,
  styleMode = 'light_modern',
  cameraZoom = 'full',
  compactStage = false,
  currentOutfitImage = null,
  isGenerating = false,
  generationStatus = 'Đang may đồ...',
  isFailed = false,
  errorMessage = 'Chưa may được bộ này',
  isCached = false,
  outfitKey = '',
  imageSourceText = '',
  onRetry,
}) => {
  return (
    <LayeredAvatarEngine
      gender={gender}
      costume={costume}
      color={color}
      bottom={bottom}
      footwear={footwear}
      accessories={accessories}
      styleMode={styleMode}
      cameraZoom={cameraZoom}
      compactStage={compactStage}
      currentOutfitImage={currentOutfitImage}
      isGenerating={isGenerating}
      generationStatus={generationStatus}
      isFailed={isFailed}
      errorMessage={errorMessage}
      isCached={isCached}
      outfitKey={outfitKey}
      imageSourceText={imageSourceText}
      onRetry={onRetry}
    />
  );
};
