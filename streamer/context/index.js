import { createContext } from 'react'
import { requestUserInfo } from './user'

export const root = {}

export const RootContext = createContext(root)

export {
    requestUserInfo
}
