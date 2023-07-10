import React from 'react'

import { Description } from '../../screens/Arrival/styles'
import { IconBox, IconBoxProps } from '../IconBox'
import { Container, Info, Label } from './styles'

export type LocationInfoProps = {
  label: string
  description: string
}

type Props = LocationInfoProps & {
  icon: IconBoxProps
}

export function LocationInfo({ label, icon, description }: Props) {
  return (
    <Container>
      <IconBox icon={icon} />

      <Info>
        <Label numberOfLines={1}>{label}</Label>

        <Description numberOfLines={1}>{description}</Description>
      </Info>
    </Container>
  )
}