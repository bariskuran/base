import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { useBaseFetch } from "../useBaseFetch";
import { Flex } from "../Flex";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { formatJsonForDisplay } from "../DesignSystem/formatJsonForDisplay";

const DEMO_URL = "https://jsonplaceholder.typicode.com/todos/1";

const FetchDemo = () => {
    const { status, isOk, response, errors, player, refetch, cancelFetch } = useBaseFetch(
        { url: DEMO_URL, disableAuth: true },
        { disableAutoStart: true },
    );

    return (
        <Flex.column gap={10} full>
            <Flex gap={8} wrap>
                <Button.plain label="play()" onClick={() => player.play()} />
                <Button.plain label="pause()" onClick={() => player.pause()} />
                <Button.plain label="refetch()" onClick={() => refetch()} />
                <Button.plain label="cancelFetch()" onClick={() => cancelFetch()} />
            </Flex>
            <Typo.span>{`status: ${status} · isOk: ${String(isOk)} · playing: ${String(player.isPlaying)}`}</Typo.span>
            {errors?.length ? (
                <Typo.code codeFormat={false}>{formatJsonForDisplay(errors)}</Typo.code>
            ) : (
                <Typo.code codeFormat={false}>{formatJsonForDisplay(response ?? {})}</Typo.code>
            )}
        </Flex.column>
    );
};

const X = () => (
    <Ds.page
        title="baseFetch"
        releasedOn="Beta"
        description={
            <>
                HTTP client with auth, cache, loading integration, and multi-call orchestration.
                Settings merge from globalData._baseFetchSettings (configured on{" "}
                <Button.string to="/design-system/base" label="<Base>" />
                ).
            </>
        }
    >
        <Ds.block
            title="useBaseFetch — hook"
            description="Returns status, response, player controls, refetch, and cancelFetch. disableAutoStart keeps the demo idle until you press play."
            code={`import { useBaseFetch } from "${SYS.basePath}";

                       const { status, response, player, refetch, cancelFetch } = useBaseFetch(
                       { url: "/api/items", disableAuth: true },
                       { disableAutoStart: true, refreshTime: 0 },
                       );`}
            example={<FetchDemo />}
        />
        <Ds.block
            title="baseFetch — imperative"
            code={`import { baseFetch } from "${SYS.basePath}";

                       const { promise, cancelFetch } = baseFetch(
                       { url: "/api/items", method: "GET", disableAuth: true },
                       { onSuccess: (res) => console.log(res), onError: (err) => console.log(err) },
                       );

                       promise.then(console.log);`}
        />
        <Ds.api
            args="const { promise, cancelFetch } = baseFetch(callOrCalls, jointSettings);"
            props={{
                callOrCalls: {
                    description: "Single call object or array of call objects (url, method, body, …).",
                    type: "object | object[]",
                    required: true,
                },
                jointSettings: {
                    description:
                        "onSuccess, onError, onCancel, enableSynchronousCalls, disableLoadingApi, envUrl.",
                    type: "object",
                },
            }}
            returnProps={{
                promise: { description: "Resolves with the aggregated fetch result.", type: "Promise" },
                cancelFetch: { description: "Aborts in-flight requests.", type: "fn" },
            }}
        />
        <Ds.api
            title="useBaseFetch"
            disableLastBlock
            args="const { status, isOk, response, responses, errors, player, refetch, cancelFetch } = useBaseFetch(callOrCalls, joint);"
            props={{
                callOrCalls: {
                    description: "Same shape as baseFetch callOrCalls.",
                    type: "object | object[]",
                    required: true,
                },
                joint: {
                    description: "refreshTime (minutes), disableAutoStart, plus baseFetch jointSettings.",
                    type: "object",
                },
            }}
            returnProps={{
                status: {
                    description: 'idle | loading | success | error | canceled',
                    type: "string",
                },
                isOk: { description: "True on success, false on error/cancel, null while idle/loading.", type: "boolean | null" },
                response: { description: "Single-call response payload.", type: "any" },
                responses: { description: "Multi-call response array.", type: "any[]" },
                errors: { description: "Validation or request errors.", type: "array" },
                player: { description: "{ play, pause, isPlaying } transport controls.", type: "object" },
                refetch: { description: "Runs the fetch again.", type: "fn" },
                cancelFetch: { description: "Aborts the current run.", type: "fn" },
            }}
        />
    </Ds.page>
);

export default X;
