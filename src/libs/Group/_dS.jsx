import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Group } from ".";
import { Button } from "../Button";
import { Flex } from "../Flex";
import { Typo } from "../Typo";

const items = [
    {
        bgColor: "error",
        label: "Lead",
        prefix: { icon: "bullet" },
        onClick: () => console.log("lead"),
    },
    { label: "Item 2", onClick: () => console.log("2") },
    { label: "Item 3", onClick: () => console.log("3") },
    { label: "Item 4", onClick: () => console.log("4") },
];

const groupProps = {
    bgColor: "success",
    prefix: { icon: "user" },
    size: 100,
};

const X = () => (
    <Ds.page
        title="<Group>"
        releasedOn="1.0.0"
        description={
            <>
                If you need to use the same component multiple times and your items share common
                properties, the 'Group' component can be useful. Group allows you to specify shared
                item properties via the 'items' and 'groupProps' parameters. By default, it renders
                with a 'Flex' wrapper. If you set 'flat', Flex is removed and it returns only the
                mapped components in a fragment.
                <br />
                <br />
                For more advanced usage, see 'ButtonGroup'.
            </>
        }
    >
        <Ds.block
            title={{ tr: "Flex sarmalayıcısı ile", en: "With Flex Wrapper" }}
            code={`import { Group, Button } from "${SYS.basePath}";

                   const items = [
                    { bgColor: "error", label: "Lead", onClick: () => {} },
                    { label: "Item 2", onClick: () => {} },
                   ];

                   <Group
                    component={Button}
                    items={items}
                    groupProps={{ bgColor: "success", prefix: { icon: "user" } }}
                    flexProps={{ gap: 5, wrap: true }}
                   />`}
            example={
                <Group
                    component={Button}
                    items={items}
                    groupProps={groupProps}
                    flexProps={{ gap: 5, wrap: true }}
                />
            }
        />
        <Ds.block
            title={{ tr: "flat — yerleşim parent'a aittir", en: "flat — Parent Owns Layout" }}
            description={{ tr: "flat true olduğunda Group, yalnızca eşlenmiş componentleri bir fragment içinde döndürür. Flex veya ScrollFlex ile kendiniz sarmalayın.", en: "When flat is true, Group returns only the mapped components in a fragment. Wrap with Flex or ScrollFlex yourself." }}
            code={`import { Group, Button, Flex } from "${SYS.basePath}";

                    <Flex gap={8}>
                        <Group
                            flat
                            component={Button.plain}
                            items={[
                                { label: "One", onClick: () => {} },
                                { label: "Two", onClick: () => {} },
                            ]}
                            groupProps={{ variant: "plain" }}
                        />
                    </Flex>`}
            example={
                <Flex gap={8}>
                    <Group
                        flat
                        component={Button.plain}
                        items={[
                            { label: "One", onClick: () => {} },
                            { label: "Two", onClick: () => {} },
                            { label: "Three", onClick: () => {} },
                        ]}
                        groupProps={{ variant: "plain" }}
                    />
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Kolon yerleşimi", en: "Column Layout" }}
            code={`import { Group, Button } from "${SYS.basePath}";

                   <Group
                    component={Button}
                    items={items}
                    groupProps={groupProps}
                    flexProps={{ direction: "column", gap: 5 }}
                   />`}
            example={
                <Group
                    component={Button}
                    items={items.slice(0, 4)}
                    groupProps={groupProps}
                    flexProps={{ direction: "column", gap: 5 }}
                />
            }
        />
        <Ds.api
            args="<Group component={Component} items={[]} />"
            props={{
                component: {
                    description:
                        "Component constructor to render for each item (e.g. Button, Button.plain).",
                    type: "component",
                    required: true,
                },
                items: {
                    description:
                        "Array of prop objects; each entry is merged with groupProps and passed to component.",
                    type: "array",
                    required: true,
                },
                groupProps: {
                    description:
                        "Deep-merged into every item; per-item keys override these defaults.",
                    type: "object",
                    defaultValue: "{}",
                },
                flexProps: {
                    description: { tr: "İç Flex sarmalayıcısına aktarılır. flat true olduğunda yok sayılır.", en: "Forwarded to the inner Flex wrapper. Ignored when flat is true." },
                    type: "object",
                    defaultValue: "{}",
                },
                flat: {
                    description:
                        "When true, renders only mapped components in a fragment — no Flex wrapper.",
                    type: "boolean",
                    defaultValue: "false",
                },
            }}
        />
    </Ds.page>
);

export default X;
