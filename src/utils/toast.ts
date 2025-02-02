import Toast from 'react-native-toast-message';

import { ToastPosition } from 'react-native-toast-message';

export function showToast(
  type: string,
  text1: string,
  text2: string,
  autoHide?: boolean,
  visibilityTime?: number,
  position?: ToastPosition
) {
  Toast.show({
    type: type,
    position: position || 'bottom',
    text1: text1,
    text2: text2,
    visibilityTime: visibilityTime || 3000, 
    autoHide: autoHide || true, 
  });
}
