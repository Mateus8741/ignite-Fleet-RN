import { createRealmContext } from '@realm/react'
import { History } from './schemas/History'

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [History],
  })
