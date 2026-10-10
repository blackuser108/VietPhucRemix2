import anNhienBaseImg from '../assets/images/an_nhien_base.jpg';
import minhTrietBaseImg from '../assets/images/minh_triet_base.jpg';

export interface CharacterConfig {
  id: 'female' | 'male';
  name: string;
  fullName: string;
  gender: 'female' | 'male';
  defaultImage: string;
  fileName: string;
  description: string;
}

export const CHARACTER_IMAGES: Record<'female' | 'male', CharacterConfig> = {
  female: {
    id: 'female',
    name: 'An Nhiên',
    fullName: 'An Nhiên (Nữ, 20 tuổi)',
    gender: 'female',
    defaultImage: anNhienBaseImg,
    fileName: 'an_nhien_base.jpg',
    description: 'Nữ thanh niên Việt Nam 20 tuổi, phong cách 2D game mobile cel-shading',
  },
  male: {
    id: 'male',
    name: 'Minh Triết',
    fullName: 'Minh Triết (Nam, 20 tuổi)',
    gender: 'male',
    defaultImage: minhTrietBaseImg,
    fileName: 'minh_triet_base.jpg',
    description: 'Nam thanh niên Việt Nam 20 tuổi, phong cách 2D game mobile đồng bộ',
  },
};
