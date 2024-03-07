import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRecoilValue } from 'recoil';
import { useResolvedPath } from 'react-router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Box, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Paper, Switch, TextField, Tooltip } from '@mui/material';
import { Dashboard } from '@/components/Dashboard';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { RootState } from '@/slices';
import { streamingInterfaceSlice } from '@/slices/streamingInterface';
import { unixtimeOffset } from '@/atoms/unixtimeOffset';
import { LyricalSocket } from '@/lyricalSocket';

function useAbsoluteUrl(to: string) {
  // 現在のURLとpathnameから`to`のURLを生成
  const resolvedPath = useResolvedPath(to);
  const currentUrl = window.location.href;
  const currentPathname = window.location.pathname;
  return currentUrl.replace(currentPathname, resolvedPath.pathname);
}

function addQueryToUrl(baseUrl: string, query: Record<string, string | number | boolean | null | undefined> = {}) {
  const url = new URL(baseUrl);
  Object.entries(query).forEach(([k, v]) => {
    if (typeof v === "string") {
      url.searchParams.set(k, v);
      return;
    }
    if (typeof v === "number") {
      url.searchParams.set(k, v.toString());
      return;
    }
    if (v) {
      url.searchParams.set(k, "");
    }
  });
  return url.href;
}

export const StreamingOverlayOpenerPage: FC = () => {
  const timeOffset = useRecoilValue(unixtimeOffset);
  const baseUrl = useAbsoluteUrl("/streaming-overlay");
  const [overlayUrl, setOverlayUrl] = useState(baseUrl);

  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const query = {
      reverse,
      timeOffset: (timeOffset === 0 ? undefined : timeOffset),
    };
    setOverlayUrl(addQueryToUrl(baseUrl, query));
  }, [baseUrl, reverse, timeOffset]);

  const [openTooltip, setOpenTooltip] = useState(false);

  return (
    <Dashboard title="配信オーバーレイ">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: "1em" }}>
            <Box>
              <TextField
                label="配信オーバーレイURL"
                value={overlayUrl}
                fullWidth
                sx={{ marginBottom: 2 }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard text={overlayUrl} onCopy={() => setOpenTooltip(true)}>
                        <Tooltip title="コピーしました！" arrow placement="top" open={openTooltip} onClose={() => setOpenTooltip(false)}>
                          <IconButton>
                            <ContentPasteIcon />
                          </IconButton>
                        </Tooltip>
                      </CopyToClipboard>
                      <a href={overlayUrl} target="_blank" rel="noreferrer">
                        <IconButton>
                          <OpenInNewIcon />
                        </IconButton>
                      </a>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Switch value={reverse} onChange={(event) => { setReverse(event.target.checked); }} />
                }
                label="左右を逆にする"
              />
            </Box>
            <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
            <Box>
              <StreamingInterfaceController />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Dashboard>
  );
}

const StreamingInterfaceController: FC = () => {
  const dispatch = useDispatch();
  const showMainHud = useSelector<RootState, boolean>((state) => state.streamingInterface.showMainHud);
  const showScoreBoard = useSelector<RootState, boolean>((state) => state.streamingInterface.showScoreBoard);
  const showSubHud = useSelector<RootState, boolean>((state) => state.streamingInterface.showSubHud);

  const onChangeShowMainHud = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch([
      streamingInterfaceSlice.actions.setShowMainHud(event.target.checked),
    ], dispatch);
  };

  const onChangeShowScoreBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch([
      streamingInterfaceSlice.actions.setShowScoreBoard(event.target.checked),
    ], dispatch);
  };

  const onChangeShowSubHud = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch([
      streamingInterfaceSlice.actions.setShowSubHud(event.target.checked),
    ], dispatch);
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch checked={showMainHud} onChange={onChangeShowMainHud} />
        }
        label="メインHUDを表示する"
      />
      <FormControlLabel
        control={
          <Switch checked={showScoreBoard} onChange={onChangeShowScoreBoard} />
        }
        label="スコアを表示する"
      />
      <FormControlLabel
        control={
          <Switch checked={showSubHud} onChange={onChangeShowSubHud} />
        }
        label="サブHUDを表示する"
      />
    </Box>
  );
}
