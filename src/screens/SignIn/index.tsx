/* eslint-disable no-unused-vars */
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import * as S from './styles'

import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button'

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '@env'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

WebBrowser.maybeCompleteAuthSession()

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [_, response, googleSignIn] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  })

  function handleGoogleSignIn() {
    setIsAuthenticating(true)

    googleSignIn().then(() => {
      if (response?.type !== 'success') {
        setIsAuthenticating(false)
      }
    })
  }

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication?.idToken) {
        fetch(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${response.authentication.idToken}`,
        )
          .then((response) => response.json())
          .then(console.log)
      } else {
        Alert.alert('Erro ao autenticar')
        setIsAuthenticating(false)
      }
    }
  }, [response])

  return (
    <S.Container source={backgroundImg}>
      <S.Title>Ignite Fleet</S.Title>

      <S.Slogan>Gestão de uso de Veículos</S.Slogan>

      <Button
        title="Entrar com google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      />
    </S.Container>
  )
}
