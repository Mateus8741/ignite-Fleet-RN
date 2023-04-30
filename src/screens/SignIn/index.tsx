import * as S from './styles'

import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button'

export function SignIn() {
  return (
    <S.Container source={backgroundImg}>
      <S.Title>Ignite Fleet</S.Title>

      <S.Slogan>Gestão de uso de Veículos</S.Slogan>

      <Button title="Entrar com google" />
    </S.Container>
  )
}
