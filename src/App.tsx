import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { BrowserRouter, Route } from 'react-router-dom'
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { createContext, useState } from 'react'

type User = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: User | undefined,
  signInWithGoogle:() => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType)

function App() {
  const [user, setUser] = useState<User>()

  async function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    const auth = getAuth()
    const result = await signInWithPopup(auth, provider)

    if(result.user){
      const { displayName, photoURL, uid } = result.user
          
      if(!displayName || !photoURL){
          throw new Error('Missing information from Google Account.')
        }

      setUser({id: uid, name: displayName, avatar: photoURL})
    } 
  } 

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, signInWithGoogle}}>
        <Route path="/" exact component = {Home} />
        <Route path="/rooms/new" component = {NewRoom} />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
