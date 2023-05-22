import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Arrival } from '../screens/Arrival'
import { Departure } from '../screens/Departure'
import { Home } from '../screens/Home'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="Home" component={Home} />
      <Screen name="Departure" component={Departure} />
      <Screen name="Arrival" component={Arrival} />
    </Navigator>
  )
}
