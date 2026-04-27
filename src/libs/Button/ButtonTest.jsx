import { Button } from "./";

export const ButtonTest = () => {
    return (
        <>
            <div>
                Lorem ipsum dolor sit amet{" "}
                <Button.string onClick={() => console.log("click")} label="Buttogn" />
            </div>
            <ButtonVariants Com={Button.animatedBg} />
            <ButtonVariants Com={Button.underline} />
            <ButtonVariants Com={Button.brackets} />
            <ButtonVariants Com={Button} />
        </>
    );
};

const ButtonVariants = ({ Com }) => (
    <div style={{ display: "flex", gap: 20 }}>
        <Com
            onClick={() => console.log("click")}
            label="Button"
            hoverLabel="Hovered"
            activeLabel="Clicked"
        />
        <Com primary to="https://www.google.com" onClick={() => console.log("click")} label="a" />
        <Com
            secondary
            to="/about-the-project"
            label="Link"
            onClick={() => console.log("click")}
            delay={2}
            onDelayStart={() => console.log("delay start")}
            onDelayEnd={() => console.log("delay end")}
            activeLabel="Clicked"
        />
        <Com
            label="Icon"
            onClick={() => console.log("click")}
            prefix={{
                icon: "abstract12",
                width: 20,
                color: "success",
                hoverColor: "green",
                hoverIcon: "eye",
                bgColor: "yellow",
                text: "Test",
            }}
        />
        <Com
            onClick={() => console.log("click")}
            primary
            icon={{
                icon: "abstract20",
                hoverIcon: "abstract21",
                width: 16,
            }}
        />
        <Com
            onClick={() => console.log("click")}
            outlined
            icon={{
                icon: "abstract20",
                hoverIcon: "abstract21",
                width: 16,
            }}
        />
        <Com
            onClick={() => console.log("click")}
            outlined
            primary
            icon={{
                icon: "abstract20",
                hoverIcon: "abstract21",
                width: 16,
            }}
        />
        <Com
            onClick={() => console.log("click")}
            size={150}
            icon={{
                icon: "abstract20",
                width: 18,
                color: "red",
                hoverIcon: "abstract21",
                hoverColor: "yellow",
                hoverWidth: 20,
                activeIcon: "abstract22",
                activeColor: "white",
                activeWidth: 22,
            }}
        />
        <Com
            to="/time-of-diyarbakir"
            icon={{
                icon: "abstract20",
                width: 18,
                color: "red",
                hoverIcon: "abstract21",
                hoverColor: "yellow",
                hoverWidth: 20,
                activeIcon: "abstract22",
                activeColor: "white",
                activeWidth: 22,
            }}
        />
        <Com onClick={() => console.log("click")} icon={{ icon: "abstract20" }} />
    </div>
);
