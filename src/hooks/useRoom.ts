import { useEffect, useState } from 'react'
import { ref, getDatabase, onValue } from 'firebase/database'

type QuestionType = {
    id: string,
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHighlighted: boolean
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string
        avatar: string
    },
    content: string
    isAnswered: boolean
    isHighlighted: boolean
}>
export function useRoom(roomId: string){
    
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')

    useEffect(() => {
        const db = getDatabase()
        
        const roomRef = ref(db, `rooms/${roomId}`)
        return onValue(roomRef, room =>{
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions  ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
    }, [roomId])

    return{ questions, title }
}