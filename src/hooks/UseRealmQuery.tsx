import { useQuery } from '../libs/realm'
import { History } from '../libs/realm/schemas/History'

export function UseRealmQuery() {
  const history = useQuery(History)

  return { history }
}
