export const componentCreator = (name, DefaultComp, variants = {}) => {
    function Main(props) {
        return <DefaultComp {...props} />;
    }

    Object.defineProperty(Main, "displayName", {
        value: name,
        writable: false,
        configurable: false,
    });

    Object.entries(variants || {}).forEach(([key, VariantComp]) => {
        const Variant = function Variant(props) {
            return <VariantComp {...props} />;
        };

        Object.defineProperty(Variant, "displayName", {
            value: `${name}.${key}`,
            writable: false,
            configurable: false,
        });

        Main[key] = Variant;
    });

    return Main;
};
