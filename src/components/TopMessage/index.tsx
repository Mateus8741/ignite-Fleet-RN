import React from 'react'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components'
import { Title } from '../Button/styles'
import { IconBoxProps } from '../ButtonIcon'
import { Container } from './styles'

type Props = {
  icon?: IconBoxProps
  title: string
}

export function TopMessage({ icon: Icon, title }: Props) {
  const { COLORS } = useTheme()
  const { top } = useSafeAreaInsets()

  const paddingTop = top + 5

  return (
    <Container
      style={{
        paddingTop,
      }}
    >
      {Icon && <Icon size={18} color={COLORS.GRAY_100} />}

      <Title>{title}</Title>
    </Container>
  )
}
