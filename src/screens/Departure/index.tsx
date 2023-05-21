import { useRef } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native'
import { Button } from '../../components/Button'
import { Header } from '../../components/Header'
import { LicensePlateInput } from '../../components/LicensePlateInput'
import { TextAreaInput } from '../../components/TextAreaInput'
import { Container, Content } from './styles'

const keyboardAvoidingViewBehavior =
  Platform.OS === 'ios' ? 'position' : 'height'

export function Departure() {
  const descriptioRef = useRef<TextInput>(null)

  function handleDepartureRegister() {
    console.log('ok')
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAvoidingView
        behavior={keyboardAvoidingViewBehavior}
        style={{ flex: 1 }}
      >
        <ScrollView bounces={false}>
          <Content>
            <LicensePlateInput
              label="Placa do veículo"
              placeholder="ABC-1234"
              onSubmitEditing={() => descriptioRef.current?.focus()}
              returnKeyType="next"
            />

            <TextAreaInput
              ref={descriptioRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              returnKeyType="send"
              onSubmitEditing={handleDepartureRegister}
              blurOnSubmit
            />

            <Button title="Registrar Saída" onPress={handleDepartureRegister} />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}
