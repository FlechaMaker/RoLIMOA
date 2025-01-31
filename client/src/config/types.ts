import { z } from 'zod';
import { configSchema } from './schema';
import {
  customControlPanelSchema,
  taskObjectToggleButtonSchema,
  taskObjectToggleSwitchSchema,
} from './schema/controlPanel';

export type ConfigType = z.infer<typeof configSchema>;

export type TaskObjectConfigType = ConfigType["rule"]["task_objects"][number];
export type TimeProgressConfigType = ConfigType["time_progress"][number];

const timerFormatSchema = configSchema.shape.time_progress.element.shape.style.unwrap().shape.timerFormat;
export type TimeFormat = NonNullable<z.infer<typeof timerFormatSchema>>;

export type CustomControlPanelType = z.infer<typeof customControlPanelSchema>;
export type TaskObjectToggleSwitchUiType = z.infer<typeof taskObjectToggleSwitchSchema>;
export type TaskObjectToggleButtonUiType = z.infer<typeof taskObjectToggleButtonSchema>;
