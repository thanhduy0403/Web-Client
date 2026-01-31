import { useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Router from "./router";
import { restoreAuth } from "./Redux/apiRequest";
import { useDispatch } from "react-redux";
import { message } from "antd";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <>
      <Chat />
      <Router />
    </>
  );
}

export default App;
