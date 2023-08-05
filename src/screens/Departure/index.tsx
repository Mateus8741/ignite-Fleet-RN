import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
import {
  LocationAccuracy,
  LocationObjectCoords,
  LocationSubscription,
  requestBackgroundPermissionsAsync,
  useForegroundPermissions,
  watchPositionAsync,
} from 'expo-location'
import { useEffect, useRef, useState } from 'react'
import { Alert, ScrollView, TextInput } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Car } from 'phosphor-react-native'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { Loading } from '../../components/Loading/indes'
import { LocationInfo } from '../../components/LocationInfo'
import { Map } from '../../components/Map'
import { TextAreaInput } from '../../components/TextAreaInput'
import { useRealm } from '../../libs/realm'
import { History } from '../../libs/realm/schemas/History'
import { startLocationTask } from '../../tasks/backgroundTaskLocation'
import { getAddressLocation } from '../../utils/getAddressLocation'
import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { openSetting } from '../../utils/openSetting'
import { Container, Content, Message, MessageContent } from './styles'

export function Departure() {
  const [licensePlate, setLicensePlate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoordinates, setCurrentCoordinates] =
    useState<LocationObjectCoords | null>(null)

  const [locationPermition, requestLocationPermition] =
    useForegroundPermissions()

  const realm = useRealm()
  const user = useUser()

  const { goBack } = useNavigation()

  const descriptioRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  async function handleDepartureRegister() {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus()
        return Alert.alert(
          'Placa inválida',
          'Por favor, digite uma placa válida',
        )
      }

      if (description.trim().length === 0) {
        descriptioRef.current?.focus()
        return Alert.alert(
          'Finalidade',
          'Por favor, digite uma finalidade da utilização do veículo',
        )
      }

      if (!currentCoordinates?.latitude && !currentCoordinates?.longitude) {
        return Alert.alert(
          'Localização',
          'Por favor, aguarde enquanto a localização é carregada',
        )
      }

      setLoading(true)

      const backgroundPermissions = await requestBackgroundPermissionsAsync()

      if (!backgroundPermissions.granted) {
        return Alert.alert(
          'Permissão de localização',
          'Por favor, conceda a permissão de localização para o aplicativo',
          [{ text: 'Abrir configurações', onPress: openSetting }],
        )
      }

      await startLocationTask()

      realm.write(() => {
        realm.create(
          'History',
          History.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
            coords: [
              {
                latitude: currentCoordinates.latitude,
                longitude: currentCoordinates.longitude,
                timestamp: new Date().getTime(),
              },
            ],
          }),
        )
      })

      Alert.alert('Sucesso', 'Saída registrada com sucesso!')

      goBack()
    } catch (error) {
      console.log(error)
      Alert.alert('Erro', 'Não foi possível registrar a saída')
      setLoading(false)
    }
  }

  useEffect(() => {
    requestLocationPermition()
  }, [])

  useEffect(() => {
    if (!locationPermition?.granted) {
      return
    }

    let subscription: LocationSubscription

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High,
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoordinates(location.coords)

        getAddressLocation(location.coords)
          .then((address) => {
            if (address) {
              setCurrentAddress(address)
            }
          })
          .finally(() => setLoadingLocation(false))
      },
    ).then((response) => (subscription = response))

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [locationPermition])

  if (!locationPermition?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <MessageContent>
          <Message>
            Você precisa permitir que o aplicativo tenha acesso a localização
            para acessar essa funcionalidade. Por favor, acesse as configurações
            do seu dispositivo para conceder a permissão ao aplicativo.
          </Message>

          <Button title="Abrir configurarões" onPress={openSetting} />
        </MessageContent>
      </Container>
    )
  }

  if (loadingLocation) {
    return <Loading />
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView bounces={false}>
          {currentCoordinates && <Map coordinates={[currentCoordinates]} />}

          <Content>
            {currentAddress && (
              <LocationInfo
                icon={Car}
                label="Localização atual"
                description={currentAddress}
              />
            )}

            <LicensePlateInput
              ref={licensePlateRef}
              label="Placa do veículo"
              placeholder="ABC-1234"
              onSubmitEditing={() => descriptioRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptioRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              returnKeyType="send"
              onSubmitEditing={handleDepartureRegister}
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegister}
              isLoading={loading}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
}
