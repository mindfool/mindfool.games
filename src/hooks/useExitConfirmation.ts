import { useNavigation, usePreventRemove } from '@react-navigation/native';
import { Alert } from 'react-native';

/**
 * Hook to show exit confirmation when user tries to leave during active session.
 * Uses React Navigation's usePreventRemove to intercept back navigation.
 *
 * @param isSessionActive - When true, shows confirmation dialog on back navigation.
 *                          When false, allows normal navigation (for completed sessions).
 */
export function useExitConfirmation(isSessionActive: boolean) {
  const navigation = useNavigation();

  usePreventRemove(isSessionActive, ({ data }) => {
    Alert.alert(
      'Leave Practice?',
      'Your session is still in progress. Are you sure you want to leave?',
      [
        {
          text: 'Stay',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            navigation.dispatch(data.action);
          },
        },
      ]
    );
  });
}
