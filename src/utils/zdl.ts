// Not real ZDL but might be actually okay to diverge –– our goal is not to generate 100% strict ZDL here
export interface ZDLStep {
  id: string;
  app: string;
  type: string;
  action: string;
  steps: ZDLStep[];
  title?: string;

  // Here's where we diverge from the ZDL spec
  alternatives?: {
    app: string;
    appLabel: string;
    type: string;
    action: string;
    actionLabel: string;
  }[];
  appLabel?: string;
  actionLabel?: string;
  // End divergence from ZDL spec

  authentication_id?: number;
  params?: Record<string, unknown>;
  comment?: string;
  meta?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ZDL extends ZDLStep {
  id: "root";
  app: "EngineAPI";
  type: "run";
  action: "series_skip_errors";
  zdl_version: "0.4";
}

/**
 * Recursively traverse through all the steps in a ZDL.
 * For each step, the `callback` function is invoked, passing in the current `ZDLStep` object and the current `ZDL` object,
 * giving the caller a chance to modify the step properties if needed.
 */
export async function traverseZDL(
  zdl: ZDL,
  callback: (step: ZDLStep, currentZDL: ZDL) => Promise<void>
) {
  const currentZDL = { ...zdl };

  async function _recurse(step: ZDLStep) {
    await callback(step, currentZDL);

    for (let i = 0; i < (step.steps || []).length; i++) {
      await _recurse(step.steps[i]);
    }
  }

  return _recurse(currentZDL);
}
