import { useNavigation } from '@react-navigation/native'
import { useUser } from '@realm/react'
import { useRef, useState } from 'react'
import { Alert, ScrollView, TextInput } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { useRealm } from '../../libs/realm'
import { History } from '../../libs/realm/schemas/History'
import { licensePlateValidate } from '../../utils/licensePlateValidate'
import { Container, Content } from './styles'

export function Departure() {
  const [licensePlate, setLicensePlate] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const realm = useRealm()
  const user = useUser()

  const { goBack } = useNavigation()

  const descriptioRef = useRef<TextInput>(null)
  const licensePlateRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
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

      setLoading(true)

      realm.write(() => {
        realm.create(
          'History',
          History.generate({
            user_id: user!.id,
            license_plate: licensePlate.toUpperCase(),
            description,
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

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView bounces={false}>
          <Content>
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
