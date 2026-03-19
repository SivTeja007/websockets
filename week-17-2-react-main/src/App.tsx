
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState(["hi there", "hello"]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL ?? "ws://localhost:8080");
    ws.onmessage = (event) => {
      setMessages((m) => [...m, String(event.data)])
    }
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, []);

  return (
    <div className='h-screen bg-black'>
      <br /><br /><br />
      <div className='h-[85vh]'>
        {messages.map((message, index) => <div className='m-8' key={`${message}-${index}`}> 
          <span className='bg-white text-black rounded p-4 '>            
            {message} 
          </span>
        </div>)}
      </div>
      <div className='w-full bg-white flex'>
        <input ref={inputRef} id="message" className="flex-1 p-4"></input>
        <button onClick={() => {
          const message = inputRef.current?.value;
          if (!message?.trim()) {
            return;
          }

          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
          }

          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message
            }
          }))

          if (inputRef.current) {
            inputRef.current.value = "";
          }

        }} className='bg-purple-600 text-white p-4'>
          Send message
        </button>
      </div>
    </div>
  )
}

export default App
