import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldSideType } from './score';

export type MatchState = {
  name: string,         // 試合名
  teams: TeamsType,     // 各チームの情報
};

type TeamsType = Record<FieldSideType, TeamType | undefined>;

export type TeamType = {
  shortName: string,    // 表示名
  id?: string,
  name?: string,
  school?: string,
};

const initialState: MatchState = {
  name: "",
  teams: {
    blue: undefined,
    red: undefined,
  },
};

export const matchStateSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<MatchState>) => action.payload,
  },
});
