import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { CarStatus } from '../../components/CarStatus'
import { HomeHeader } from '../../components/HomeHeader'
import * as S from './styles'

export function Home() {
  const { navigate } = useNavigation()

  function handleRegisterMovement() {
    navigate('Departure')
  }

  return (
    <S.Container>
      <HomeHeader />

      <S.Content>
        <CarStatus onPress={handleRegisterMovement} />
      </S.Content>
    </S.Container>
  )
}
