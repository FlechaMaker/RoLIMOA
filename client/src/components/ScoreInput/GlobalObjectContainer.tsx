import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'slices';
import { scoreStateSlice } from 'slices/score';
import { PluseMinuseButtonControl } from './PluseMinuseButtonControl';
import { ErrorObject } from './ErrorObject';
import { LyricalSocket } from 'lyricalSocket';
import { CustomControlPanelType, TaskObjectConfigType } from 'config/types';
import { ToggleSwitchControl } from './ToggleSwitchControl';
import { ToggleButtonControl } from './ToggleButtonControl';

type GlobalObjectContainerProps = {
  taskConfig: TaskObjectConfigType,
  controlConfig?: CustomControlPanelType,
};

export const GlobalObjectContainer: FC<GlobalObjectContainerProps> = ({
  taskConfig,
  controlConfig,
}) => {
  const { id } = taskConfig;

  const currentValue = useSelector<RootState, number|undefined>((state) => state.score.global[id]);
  const dispatch = useDispatch();

  const stateUpdate = useCallback((value: number) => {
    const action = scoreStateSlice.actions.setGloablUpdate({
      taskObjectId: id,
      afterValue: value,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, id]);

  if (currentValue === undefined) {
    console.error(`ふぇぇ！"${id}"のタスクオブジェクトが取得できないよぉ`);
    return <ErrorObject description={taskConfig.description} />;
  }

  return (
    controlConfig?.type === "toggle_switch" ? 
      <ToggleSwitchControl
        color="default"
        config={taskConfig}
        currentValue={currentValue}
        stateUpdate={stateUpdate}
        controlConfig={controlConfig}
      />
    : controlConfig?.type === "toggle_button" ?
      <ToggleButtonControl
        config={taskConfig}
        currentValue={currentValue}
        stateUpdate={stateUpdate}
        controlConfig={controlConfig}
      />
    : <PluseMinuseButtonControl
        color="inherit"
        config={taskConfig}
        currentValue={currentValue}
        stateUpdate={stateUpdate}
      />
  )
};
