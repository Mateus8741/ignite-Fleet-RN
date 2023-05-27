import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
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

import Realm from 'realm'

import Toast from 'react-native-toast-message'

import { CloudArrowUp } from 'phosphor-react-native'
import { TopMessage } from '../../components/TopMessage'
import {
  getLastSyncTimestamp,
  saveLastSyncTimestamp,
} from '../../libs/asyncStorage/syncStorage'

export function Home() {
  const [vehicle, setVehicle] = useState<History | null>(null)
  const [vehicleHistory, setVehicleHistory] = useState<HistoryCardProps[]>([])
  const [percetageToSync, setPercentageToSync] = useState<string | null>(null)

  const { navigate } = useNavigation()

  const { history } = UseRealmQuery()

  const realm = useRealm()

  const user = useUser()

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

  async function fetchHistory() {
    try {
      const response = history.filtered(
        "status='arrival' SORT(created_at DESC)",
      )

      const lastSync = await getLastSyncTimestamp()

      const formattedHistory = response.map((item) => {
        return {
          id: item._id.toString(),
          license_plate: item.license_plate,
          isSync: lastSync >= item.updated_at!.getTime(),
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

  async function progressNotification(
    transferred: number,
    transferable: number,
  ) {
    const percentage = (transferred / transferable) * 100

    if (percentage === 100) {
      await saveLastSyncTimestamp()
      await fetchHistory()
      setPercentageToSync(null)

      Toast.show({
        type: 'info',
        text1: 'Sincronização concluída',
      })
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`)
    }
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

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historyByUserQuery = realm
        .objects<History>('History')
        .filtered(`user_id = "${user?.id}"`)

      mutableSubs.add(historyByUserQuery, { name: 'history_by_user' })
    })
  }, [realm])

  useEffect(() => {
    const syncSession = realm.syncSession

    if (!syncSession) {
      return
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification,
    )

    return () => {
      syncSession.removeProgressNotification(progressNotification)
    }
  }, [])

  return (
    <S.Container>
      {percetageToSync && (
        <TopMessage title={percetageToSync} icon={CloudArrowUp} />
      )}

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
