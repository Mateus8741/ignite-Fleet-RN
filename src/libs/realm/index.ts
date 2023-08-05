import { createRealmContext } from '@realm/react'
import { Coords } from './schemas/Coords'
import { History } from './schemas/History'

import Realm from 'realm'

const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
  type: Realm.OpenRealmBehaviorType.OpenImmediately,
}

export const syncConfig: any = {
  flexible: true,
  newRealmFileBehavior: realmAccessBehavior,
  existingRealmFileBehavior: realmAccessBehavior,
}

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [History, Coords],
    schemaVersion: 1,
  })
