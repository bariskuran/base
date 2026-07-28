import Ds from "libs/DesignSystem";
import { SYS } from "../../constants/SYS";
import { Typo } from "libs/Typo";
import { Flex } from "libs/Flex";

const X = () => {
    return (
        <Ds.page
            title="NestedBaseUi"
            releasedOn="1.0.0"
            description={`NestedBaseUi is an internal UI-layer context provider used to prevent variant conflicts in nested UI components.

When UI components are deeply nested (for example PopOver > ButtonGroup > ScrollFlex), each one may have its own default variant. Even if they do not technically override each other, combining all default variants creates visual noise. NestedBaseUi marks nested components so inner components can switch to plain behavior instead of applying another full variant style stack.

In short: outer UI component keeps the main variant, inner UI components fall back to plain-like behavior to avoid design collisions.

At this stage, this is mainly architectural documentation. Usage examples will be expanded when higher-level Table/layout integrations are finalized.`}
        >
            <Ds.block
                title="Intent (architecture note)"
                code={`import NestedBaseUi from "${SYS.basePath}/helpers/NestedBaseUi";

                       // conceptual nesting example
                       <PopOver>
                       <ButtonGroup>
                       <ScrollFlex>
                       ...
                       </ScrollFlex>
                       </ButtonGroup>
                       </PopOver>`}
                example={
                    <Flex.column gap={10}>
                        <Typo.p>
                            Context value carries the nesting flag so component creators can detect parent UI
                            boundaries and avoid applying full default variants on inner layers.
                        </Typo.p>
                        <Typo.code>{`{
  "__hasParentUiComponent": true,
  "__typoPhrasingHost": true
}`}</Typo.code>
                    </Flex.column>
                }
            />

            <Ds.api
                args={'<NestedBaseUi value={{ ... }} content={node} />  |  <NestedBaseUi value={{ ... }}>{children}</NestedBaseUi>'}
                returns="React context provider wrapper for internal nested-UI coordination."
                props={{
                    value: {
                        description:
                            "Optional extra context merged with the parent NestedBaseUi layer (if any), then with internal flags such as __hasParentUiComponent. Typo sets __typoPhrasingHost under phrasing-only hosts (e.g. Typo.p) so nested Typo.code maps to a <code> root instead of <pre>.",
                        type: "object",
                    },
                    content: {
                        description:
                            "Preferred payload when the node may be a list or Fragment. Avoids React missing-key warnings that get attributed to NestedBaseUi when the same payload is passed as children. Typo uses this for phrasing hosts.",
                        type: "ReactNode",
                    },
                    children: {
                        description:
                            "Nested UI subtree (single element preferred). Used by ScrollFlex / FloatingUi. Ignored when content is set.",
                        type: "ReactNode",
                    },
                }}
            />
        </Ds.page>
    );
};

export default X;
