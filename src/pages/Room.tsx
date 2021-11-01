import { useParams } from 'react-router-dom'
import { RoomCode } from '../components/RoomCode'
import { Button } from '../components/Button'
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { push, ref, getDatabase } from 'firebase/database'
import logoImg from '../assets/images/logo.svg'
import '../styles/room.scss'

type RoomParams = {
    id: string
}

export function Room(){
    const {user} = useAuth()
    const params = useParams<RoomParams>()
    const [newQuestion, setNewQuestion] = useState('')
    const roomId = params.id

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault()
        if(newQuestion.trim() === ''){
            return
        }

        if(!user){
            throw new Error('You most be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighlighted: false,
            isAnswered: false
        }

        const db = getDatabase()
        await push(ref(db, `rooms/${roomId}/questions`), question)
        
        setNewQuestion('')
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={params.id}/>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala React</h1>
                    <span>4 perguntas</span>
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea placeholder="O que você quer perguntar"
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}/>
                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}