import Ds from "../DesignSystem";

const settingsExample = `// projectSettings (PROJECT_SETTINGS)
idleManagerSettings: {
    enabled: true,
    allowedIdleTime: 30, // minutes — default when omitted or invalid
    onIdle: ({ baseStore, nowTs, idleForMs, allowedIdleMinutes }) => {
        // e.g. dim UI, pause media, show screensaver
    },
    onActive: ({ baseStore, nowTs, reason }) => {
        // e.g. restore UI after user returns (reason: mousemove, keydown, …)
    },
},`;

const X = () => (
    <Ds.page
        title="IdleManager"
        releasedOn="1.0.0"
        description={
            <>
                Built-in subsystem mounted by Base when the app is ready. You do not import or
                render 'IdleManager' yourself — it runs alongside routing and syncs 'isIdle' into
                global data.
                <br />
                <br />
                Configure behavior via 'projectSettings.idleManagerSettings' (merged into{" "}
                globalData._idleManager). Default idle threshold is <strong>30 minutes</strong> of
                no user activity.
                <br />
                <br />
                Activity is detected from throttled 'mousemove', 'scroll', 'pointerdown', 'keydown',
                and tab focus via 'visibilitychange'. The main customization surface is 'onIdle' and
                'onActive' — use them for any app-specific effect (overlay, analytics, pausing work,
                etc.).
                <br />
                <br />
                Idle status also updates the global data 'isIdle' and can be accessed from anywhere
                in the app.
            </>
        }
    >
        <Ds.block
            title="Settings"
            description="Pass this object from your app PROJECT_SETTINGS into Base. Callbacks are optional; when omitted, only console logs and global isIdle updates run."
            code={settingsExample}
        />
        <Ds.block
            title="onIdle / onActive"
            description={
                <>
                    <code>onIdle</code> runs once when the idle timer elapses after the last
                    activity.
                    <code>onActive</code> runs when the user was idle and interacts again (not on
                    every activity while already active). Both receive <code>baseStore</code> if you
                    need to read or update global state inside your effect.
                </>
            }
        />
        <Ds.api
            args="PROJECT_SETTINGS.idleManagerSettings: { enabled, allowedIdleTime, onIdle, onActive }"
            props={{
                enabled: {
                    description:
                        "Turns idle tracking on or off. When false, timer stops and isIdle stays false.",
                    type: "boolean",
                    defaultValue: "true",
                },
                allowedIdleTime: {
                    description:
                        "Minutes without activity before onIdle fires. Invalid or non-positive values fall back to 30.",
                    type: "number",
                    defaultValue: "30",
                },
                onIdle: {
                    description:
                        "Called when idle threshold is reached. Args: { baseStore, nowTs, idleForMs, allowedIdleMinutes }.",
                    type: "fn",
                },
                onActive: {
                    description:
                        "Called when user returns after being idle. Args: { baseStore, nowTs, reason } (reason e.g. mousemove, keydown, visibilitychange).",
                    type: "fn",
                },
            }}
        />
    </Ds.page>
);

export default X;
