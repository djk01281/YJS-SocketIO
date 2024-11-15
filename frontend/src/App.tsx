import { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

export default function App() {
  const [toggle, setToggle] = useState(false);

  const ydocRef = useRef<Y.Doc>();
  const providerRef = useRef<SocketIOProvider>();

  useEffect(() => {
    ydocRef.current = new Y.Doc();

    const provider = new SocketIOProvider(
      "http://localhost:3000",
      "room-name",
      ydocRef.current,
      {
        autoConnect: true,
        disableBc: false,
      },
      {
        reconnectionDelayMax: 10000,
        timeout: 5000,
        transports: ["websocket", "polling"],
      }
    );

    providerRef.current = provider;

    provider.awareness.setLocalState({
      user: {
        name: `User-${Math.floor(Math.random() * 100)}`,
      },
    });

    const toggleMap = ydocRef.current.getMap("toggleMap");

    const updateToggleState = () => {
      const newValue = toggleMap.get("toggle");
      setToggle(Boolean(newValue));
    };
    if (!toggleMap.has("toggle")) {
      toggleMap.set("toggle", false);
    } else {
      updateToggleState();
    }

    toggleMap.observe(() => {
      updateToggleState();
    });

    return () => {
      provider.destroy();
      ydocRef.current?.destroy();
    };
  }, []);

  const handleToggle = () => {
    if (!ydocRef.current) return;

    const toggleMap = ydocRef.current.getMap("toggleMap");
    const newValue = !toggle;

    toggleMap.set("toggle", newValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#231f20",
      }}
    >
      <button
        onClick={handleToggle}
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          transition: "background-color 0.3s",
          backgroundColor: toggle ? "#f7b528" : "#e9203d",
          border: "none",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
