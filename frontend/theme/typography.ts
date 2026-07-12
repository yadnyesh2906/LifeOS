import { TextStyle } from 'react-native';

export const typography = {
  sizes: {
    caption2: 11,
    caption1: 12,
    footnote: 13,
    subheadline: 15,
    body: 17,
    headline: 17,
    title3: 20,
    title2: 22,
    title1: 28,
    largeTitle: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export default typography;
