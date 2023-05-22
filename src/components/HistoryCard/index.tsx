import React from 'react'

import { Check, Clock } from 'phosphor-react-native'
import { TouchableOpacityProps } from 'react-native'
import { useTheme } from 'styled-components'
import { Container, Departure, Info, LicensePlate } from './styles'

export type HistoryCardProps = {
  id: string
  license_plate: string
  created: string
  isSync: boolean
}

type Props = TouchableOpacityProps & {
  data: HistoryCardProps
}

export function HistoryCard({ data, ...rest }: Props) {
  const { COLORS } = useTheme()

  return (
    <Container activeOpacity={0.7} {...rest}>
      <Info>
        <LicensePlate>{data.license_plate}</LicensePlate>

        <Departure>{data.created}</Departure>
      </Info>

      {data.isSync ? (
        <Check color={COLORS.BRAND_LIGHT} size={24} weight="fill" />
      ) : (
        <Clock color={COLORS.GRAY_400} size={24} weight="fill" />
      )}
    </Container>
  )
}
