import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import './App.css';
function App() {
    const [messages, setMessages] = useState(["hi there", "hello"]);
    const wsRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WS_URL ?? "ws://localhost:8080");
        ws.onmessage = (event) => {
            setMessages((m) => [...m, String(event.data)]);
        };
        wsRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: "red"
                }
            }));
        };
        return () => {
            ws.close();
        };
    }, []);
    return (_jsxs("div", { className: 'h-screen bg-black', children: [_jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("div", { className: 'h-[85vh]', children: messages.map((message, index) => _jsx("div", { className: 'm-8', children: _jsx("span", { className: 'bg-white text-black rounded p-4 ', children: message }) }, `${message}-${index}`)) }), _jsxs("div", { className: 'w-full bg-white flex', children: [_jsx("input", { ref: inputRef, id: "message", className: "flex-1 p-4" }), _jsx("button", { onClick: () => {
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
                            }));
                            inputRef.current.value = "";
                        }, className: 'bg-purple-600 text-white p-4', children: "Send message" })] })] }));
}
export default App;
//# sourceMappingURL=App.js.map