import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList } from 'react-native'
import { CarStatus } from '../../components/CarStatus'
import { HistoryCard, HistoryCardProps } from '../../components/HistoryCard'
import { HomeHeader } from '../../components/HomeHeader'
import { UseRealmQuery } from '../../hooks/UseRealmQuery'
import { useRealm } from '../../libs/realm'
import { History } from '../../libs/realm/schemas/History'
import * as S from './styles'

export function Home() {
  const [vehicle, setVehicle] = useState<History | null>(null)
  const [vehicleHistory, setVehicleHistory] = useState<HistoryCardProps[]>([])

  const { navigate } = useNavigation()

  const { history } = UseRealmQuery()

  const realm = useRealm()

  function handleRegisterMovement() {
    if (vehicle?._id) {
      navigate('Arrival', { id: vehicle?._id.toString() })
    } else {
      navigate('Departure')
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function fetchVehicleInUse() {
    try {
      const vehicle = history.filtered('status = "departure"')[0]

      setVehicle(vehicle)
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Veículo em uso',
        'Não foi possível encontrar um veículo em uso.',
      )
    }
  }

  function fetchHistory() {
    try {
      const response = history.filtered(
        "status='arrival' SORT(created_at DESC)",
      )
      const formattedHistory = response.map((item) => {
        return {
          id: item._id.toString(),
          license_plate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format(
            '[Saída em] DD/MM/YYYY [às] HH:mm',
          ),
        }
      })

      setVehicleHistory(formattedHistory)
    } catch (error) {
      console.log(error)
      Alert.alert('Histórico', 'Não foi possível carregar o histórico.')
    }
  }

  function handleHistoryDetails(id: string) {
    navigate('Arrival', { id })
  }

  useEffect(() => {
    fetchVehicleInUse()
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [history])

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse())

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener('change', fetchVehicleInUse)
      }
    }
  }, [])

  return (
    <S.Container>
      <HomeHeader />

      <S.Content>
        <CarStatus
          onPress={handleRegisterMovement}
          licensePlate={vehicle?.license_plate}
        />

        <S.Title>Histórico</S.Title>

        <FlatList
          data={vehicleHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryCard
              data={item}
              onPress={() => handleHistoryDetails(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <S.Label>Não há registros de saída de veículos.</S.Label>
          }
        />
      </S.Content>
    </S.Container>
  )
}
