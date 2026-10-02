import { useState } from "react";
import StartScreen from "./components/StartScreen";
import VirtualMirror from "./components/VirtualMirror";

export default function App() {
  const [started, setStarted] = useState(false);
  return started ? <VirtualMirror /> : <StartScreen onStart={() => setStarted(true)} />;
}
