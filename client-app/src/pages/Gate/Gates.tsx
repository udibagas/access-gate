import { Gate } from "../../types";
import GateTable from "./GateTable";
import { DataTableProvider } from "../../providers/DataTableProvider";
import { useEffect, useRef, useState } from "react";

interface WebSocketMessage {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export default function Gates() {
  const [log, setLog] = useState<WebSocketMessage[]>([]);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const host = window.location.host.split(":")[0];
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${host}:8090`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onmessage = (event) => {
      setLog((prevLog) => {
        const newLog = [...prevLog];
        newLog.unshift(JSON.parse(event.data));
        return newLog;
      });
    };

    socket.current.onopen = () => {
      console.log("WebSocket connection established!!!");
    };

    socket.current.onclose = () => {
      console.log("WebSocket connection closed!!!");
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return (() => {
      if (socket) {
        socket.current?.close();
        socket.current = null;
      }
    })
  }, [])

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <DataTableProvider<Gate> url='/api/gates'>
          <GateTable />
        </DataTableProvider>
      </div>

      <div className="bg-slate-800 p-4 h-[calc(100vh-150px)] overflow-y-auto text-green-500 font-mono">
        {log.map((message: WebSocketMessage, index: number) => (
          <div key={index} className="whitespace-pre-wrap">
            {'$'} {new Date(message.timestamp).toLocaleString('id', { dateStyle: 'short', timeStyle: 'medium' })} [{message.level.toUpperCase()}] {message.message}
          </div>
        ))}
      </div>
    </div>
  );
};
