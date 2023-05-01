/* eslint-disable camelcase */
import { REALM_APP_ID } from '@env'

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'

import { AppProvider, UserProvider } from '@realm/react'

import { StatusBar } from 'react-native'

import { ThemeProvider } from 'styled-components/native'
import { Loading } from './src/components/Loading/indes'
import { SignIn } from './src/screens/SignIn'

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Routes } from './src/routes'
import theme from './src/theme'

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  })

  if (!fontsLoaded) {
    return <Loading />
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <Routes />
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  )
}
