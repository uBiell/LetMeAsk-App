import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { Button } from '../components/Button'
import { useParams, useHistory } from 'react-router-dom'
import { useRoom } from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg'
// import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/images/logo.svg'
import '../styles/question.scss'
import '../styles/room.scss'
import { getDatabase, ref, remove, update } from '@firebase/database'

type RoomParams = {
    id: string
}

export function AdminRoom(){
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id
    const { title, questions } = useRoom(roomId)
    // const {user} = useAuth()

    async function handleEndRoom(){
        const db = getDatabase()
        await update(ref(db, `rooms/${roomId}`), {
            endedAt: new Date()
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm('Você tem certeza que deseja excluir esta pergunta?')){
            const db = getDatabase()
            await remove(ref(db, `rooms/${roomId}/questions/${questionId}`)) 
        }
    }
    
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={params.id}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                
                <div className="question-list">
                    {questions.map(question =>{
                        return(
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>

                        )
                    })}
                </div>
            </main>
        </div>
    )
}