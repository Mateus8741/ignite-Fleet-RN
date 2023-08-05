/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import { Realm } from '@realm/react'
import { CoordsSchemaProps } from './Coords'

type GenerateProps = {
  user_id: string
  description: string
  license_plate: string
  coords: CoordsSchemaProps[]
}

export class History extends Realm.Object<History> {
  _id!: string
  user_id!: string
  license_plate!: string
  description!: string
  coords!: CoordsSchemaProps[]
  status!: string
  created_at!: Date
  updated_at!: Date

  static generate({
    user_id,
    description,
    license_plate,
    coords,
  }: GenerateProps) {
    return {
      _id: new Realm.BSON.UUID(),
      user_id,
      description,
      coords,
      license_plate,
      status: 'departure',
      created_at: new Date(),
      updated_at: new Date(),
    }
  }

  static schema = {
    name: 'History',
    primaryKey: '_id',
    properties: {
      _id: 'uuid',
      user_id: { type: 'string', indexed: true },
      license_plate: 'string',
      description: 'string',
      coords: {
        type: 'list',
        objectType: 'Coords',
      },
      status: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
  }
}
