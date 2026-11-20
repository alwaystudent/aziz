import React from 'react';
import { SimulationType } from '../../types/curriculum';
import { FractionLab } from './FractionLab';
import { GeometryLab } from './GeometryLab';
import { CircuitLab } from './CircuitLab';
import { PhotosynthesisLab } from './PhotosynthesisLab';
import { HeartLab } from './HeartLab';
import { ArabicSentenceLab } from './ArabicSentenceLab';
import { HamzaLab } from './HamzaLab';
import { FrenchVerbLab } from './FrenchVerbLab';

interface SimulationStageProps {
  simType: SimulationType;
}

export const SimulationStage: React.FC<SimulationStageProps> = ({ simType }) => {
  switch (simType) {
    case 'fractions':
      return <FractionLab />;
    case 'geometry':
      return <GeometryLab />;
    case 'circuit':
      return <CircuitLab />;
    case 'photosynthesis':
      return <PhotosynthesisLab />;
    case 'heart':
      return <HeartLab />;
    case 'sentence':
      return <ArabicSentenceLab />;
    case 'hamza':
      return <HamzaLab />;
    case 'french_verbs':
      return <FrenchVerbLab />;
  }
};
