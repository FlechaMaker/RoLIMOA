import React, { FC, useEffect } from 'react';
import { ScoreInputPage } from './ScoreInputPage';
import { LyricalSocket } from './lyricalSocket';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import { WholeScoreState, PhaseState, RootState, connectionStateSlice, phaseStateSlice, scoreStateSlice } from './store';
import { HomePage } from './HomePage';
import { LoadingOverlay } from "./LoadingOverlay";
import { AdminPage } from './AdminPage';

const App: FC = () => {
  const isConnect = useSelector<RootState, boolean>((state) => state.connection);
  const dispatch = useDispatch();

  // Websocketを用意
  useEffect(() => {
    const socket = LyricalSocket.instance.socket;

    socket.on("welcome", (data: {scoreState: WholeScoreState, phaseState: PhaseState}) => {
      console.log("welcome", data);
      dispatch(scoreStateSlice.actions.setCurrent(data.scoreState));
      dispatch(phaseStateSlice.actions.setCurrent(data.phaseState));
      dispatch(connectionStateSlice.actions.setCurrent(true));
    });

    socket.io.on("reconnect_attempt", () => {
      dispatch(connectionStateSlice.actions.setCurrent(false));
    });

    socket.on("dispatch", (action: any) => {
      console.log("dispatch from server", action);
      dispatch(action);
    });
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/score/red" element={<ScoreInputPage fieldSide="red" />} />
        <Route path="/score/blue" element={<ScoreInputPage fieldSide="blue" />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <LoadingOverlay loading={!isConnect}/>
    </>
  );
}
  
export default App;
