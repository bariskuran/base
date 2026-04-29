/**
 * İlk obje (genelde kullanıcı) base, ikinci obje (bizim hesap) override eder.
 */
export const mergeStyles = (base, override) => {
    if (!base && !override) return undefined;
    if (!base) return { ...override };
    if (!override) return { ...base };

    return {
        ...base,
        ...override,
    };
};
