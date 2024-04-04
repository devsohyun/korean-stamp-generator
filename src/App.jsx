import { useState } from 'react'
import "./styles/main.scss"
import { Sections } from './componenets/sections'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Sections></Sections>
  )
}

export default App
