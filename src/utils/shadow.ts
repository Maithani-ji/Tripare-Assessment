import { Platform } from 'react-native';

export const shadow = (elev = 6) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: elev,
      shadowOffset: { width: 0, height: Math.ceil(elev / 2) },
    },
    android: { elevation: elev },
    default: {},
  });
