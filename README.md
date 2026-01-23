## < Base />
Base uygulamanı tek bir yerde toplayan bir app shelldir. Error Boundary, App Suspense, Styled-components, global context api, global styling, loading yönetimlerini barındırır.

```js
import { Base } from "@bariskuran/base";

export  default  function App() {
	return (
		<Base>
			<YourApp />
		</Base>
	);
}
```
<details><summary><strong>Error Boundary:</strong> Async error wrapper. ErrorFallback verilmezse wrapper devreye girmez.</summary>

| Prop | Type | Description |
|---|---|---|
| `ErrorFallback` | `ReactNode` | Error boundary wrapper |
| `OTHER_` | `ReactNode` | Suspense wrapper |
</details>
