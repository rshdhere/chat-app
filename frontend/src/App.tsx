import { useEffect, useRef, useState } from "react"

function App() {

  const [messages, setMessages] = useState(["hi there", "hell"]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket>(null);

  useEffect(() => {
    const wss = new WebSocket('http://localhost:8080');

    wss.onmessage = (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === 'chat') {
        setMessages(m => [...m, parsedMessage.payload.message]);
      }
    }

    wsRef.current = wss;

    wss.onopen = () => {
      wss.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
  }, [])

  return (
    <div className="h-screen bg-black">
      <br />
      <div className="h-[95vh]">
        {messages.map( message => <div className="m-8">
          <span className="bg-white text-black rounded p-4 m-4 "> { message } </span>
        </div> )}
      </div>
      <div className="text-black flex">
        <input ref={inputRef} className="w-full flex-1 bg-amber-50" type="text" placeholder="message here" />
        <button className="bg-purple-400 text-white" onClick={() => {
          const message = inputRef.current?.value?.trim();
          if (message) {
            wsRef.current?.send(JSON.stringify({
              type: 'chat',
              payload: {
                message: message
              }
            }));
            if (inputRef.current) {
              inputRef.current.value = '';
            }
          }
        }}>Send Message</button>
      </div>
    </div>
  )
}

export default App
