import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { RootState } from './store/store'


export const socket = io(process.env.NEXT_PUBLIC_WS_URL as string, {
    autoConnect: false, 
})
function useConnectSocket() {
    const {currentUser} = useSelector((state: RootState) => state.currentUser)
    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            socket.auth = { token }
        }
        socket.connect()
        socket.on('connect', () => {
            console.log('connected')
        })
        socket.emit("join", currentUser?._id)
        socket.on('connect_error', (error) => {
            console.log('connect_error', error)
        })
        socket.on('disconnect', () => {
            console.log('disconnected')
        })
        return () => {
            socket.disconnect()
        }
    }, [currentUser])
}

export default useConnectSocket