# @bariskuran/base

Advanced hooks, functions, components for React projects.

```js
npm install @bariskuran/base
```

or

```js
yarn add @bariskuran/base
```

**Required dependencies:**
• react >=17.0.0
• react-dom >=17.0.0
• react-router-dom >=6.0.0
• styled-components >=6.0.0

## <Base>

Base uygulamanı tek bir yerde toplayan bir app shelldir. Error Boundary, App Suspense, Styled-components, global context api, global styling, loading yönetimlerini barındırır.

```js
import { Base } from "@bariskuran/base";

export default function App() {
    return (
        <Base>
            <YourApp />
        </Base>
    );
}
```

Çalışan akordiyon örneği:

<details><summary><strong>Error Boundary:</strong> Async error wrapper. ErrorFallback verilmezse wrapper devreye girmez.</summary>

| Prop            | Type        | Description            |
| --------------- | ----------- | ---------------------- |
| `ErrorFallback` | `ReactNode` | Error boundary wrapper |
| `OTHER_`        | `ReactNode` | Suspense wrapper       |

</details>

1- Error Boundary: Async error wrapper. ErrorFallback verilmezse wrapper devreye girmez.

```js
import { Base } from "base";

function AppError() {
    return <div>Something went wrong.</div>;
}

export default function App() {
    return (
        <Base ErrorFallback={<AppError />}>
            <YourApp />
        </Base>
    );
}

ErrorFallback - ReactNode - Optional;
OTHER_ERROR_BOUNDARY_PROPS - Object - Optional;
```

```js
<Base
    /** A React Suspense wrapper. Async. Optional */
    SuspenseFallback={<SuspenceFallback />}
    /** Error boundary wrapper. Async. Optional */
    ErrorFallback={<ErrorFallback />}
    /** Mandatory if you want to use styled-components.
    {
        background: "#17181c",
        foreground: "#E0E0E0",
        grey: "#3A3A3A",
        ...
    }
    To access theme, 

    const Styled = styled.div`
        ${({ theme }) => css`
            color: ${theme.background};
            ...
     * */
    STYLED_COMPONENTS_THEME={THEME}
    /* Styling için kullanılan maximum aspect ratio. Default value is 1/2 */
    MAX_ASP_RATIO
    /* Styling için kullanılan minimum aspect ratio. Default value is 3/1 */
    MIN_ASP_RATIO
    /* Styling sisteminin responsive sistemi için kullandığı viewport ayarları. Optional. */
    SYSTEM_BREAKPOINTS
>
    {yourApp}
</Base>
```
