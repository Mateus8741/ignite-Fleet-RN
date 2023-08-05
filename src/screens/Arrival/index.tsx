import { useNavigation, useRoute } from '@react-navigation/native'
import { X } from 'phosphor-react-native'
import { Button } from '../../components/Button'
import { ButtonIcon } from '../../components/ButtonIcon'
import { Header } from '../../components/Header'
import { Map } from '../../components/Map'

import { BSON } from 'realm'
import { useObject, useRealm } from '../../libs/realm'
import { History } from '../../libs/realm/schemas/History'

import { Alert } from 'react-native'

import { useEffect, useState } from 'react'
import { LatLng } from 'react-native-maps'
import { Locations } from '../../components/Location'
import { getStorageLocations } from '../../libs/asyncStorage/locationStorage'
import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage'
import { stopLocationTask } from '../../tasks/backgroundTaskLocation'
import {
  AsyncMessage,
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from './styles'

type RouteParamsProps = {
  id: string
}

export function Arrival() {
  const [dataNotSynced, setDataNotSynced] = useState(false)
  const [coordinates, setCoordinates] = useState<LatLng[]>([])

  const route = useRoute()
  const realm = useRealm()
  const { goBack } = useNavigation()

  const { id } = route.params as RouteParamsProps

  const history = useObject(History, new BSON.UUID(id))

  const title = history?.status === 'departure' ? 'Chegada' : 'Detalhes'

  function handleRemoveVehicleUsage() {
    Alert.alert('Cancelar', 'Deseja realmente cancelar o uso do veículo?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: () => removeVehicleUsage(),
      },
    ])
  }

  async function removeVehicleUsage() {
    try {
      realm.write(() => {
        realm.delete(history)
      })

      await stopLocationTask()

      goBack()
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar o uso do veículo.')
    }
  }

  async function handleArrivalRegister() {
    try {
      if (!history) {
        return Alert.alert('Erro', 'Não foi possível registrar a chegada.')
      }

      const location = await getStorageLocations()

      realm.write(() => {
        history.status = 'arrival'
        history.updated_at = new Date()
        history.coords.push(...location)
      })

      await stopLocationTask()

      Alert.alert('Sucesso', 'Chegada registrada com sucesso.')

      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível registrar a chegada.')
    }
  }

  async function getLocationsInfo() {
    if (!history) {
      return
    }

    const lastSync = await getLastSyncTimestamp()
    const updatedAt = history!.updated_at.getTime()
    setDataNotSynced(updatedAt > lastSync)

    if (history?.status === 'departure') {
      const location = await getStorageLocations()
      setCoordinates(location)
    } else {
      setCoordinates(history?.coords ?? [])
    }
  }

  useEffect(() => {
    getLocationsInfo()
  }, [])

  return (
    <Container>
      <Header title={title} />

      {coordinates.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations
          departure={{ label: 'Saída', description: 'Saída teste' }}
          arrival={{ label: 'Chegada', description: 'Chegada teste' }}
        />

        <Label>Placa do veículo</Label>

        <LicensePlate>{history?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{history?.description}</Description>
      </Content>

      {history?.status === 'departure' && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />

          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da
          {history?.status === 'departure' ? 'partida' : 'chegada'}
          pendente
        </AsyncMessage>
      )}
    </Container>
  )
}
