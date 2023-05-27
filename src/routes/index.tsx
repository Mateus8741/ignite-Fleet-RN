import { NavigationContainer } from '@react-navigation/native'
import { AppRoutes } from './app.routes'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { TopMessage } from '../components/TopMessage'

export function Routes() {
  const { top } = useSafeAreaInsets()

  return (
    <NavigationContainer>
      <AppRoutes />

      <Toast
        config={{
          info: ({ text1, ...rest }) => (
            <TopMessage {...rest} title={String(text1)} />
          ),
        }}
        topOffset={top}
      />
    </NavigationContainer>
  )
}
