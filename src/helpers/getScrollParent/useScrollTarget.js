import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getDocumentScrollElement, getScrollParent, normalizeScrollSource } from "./index";

export const useScrollTarget = (sourceProp) => {
    const elementRef = useRef(null);
    const [element, setElement] = useState(null);
    const [source, setSource] = useState(() =>
        sourceProp != null ? normalizeScrollSource(sourceProp) : getDocumentScrollElement(),
    );

    useEffect(() => {
        if (sourceProp != null) {
            setSource(normalizeScrollSource(sourceProp));
            return;
        }

        if (!element) {
            setSource(getDocumentScrollElement());
        }
    }, [sourceProp, element]);

    const resolveFromElement = useCallback(
        (el) => {
            if (sourceProp != null) return;

            if (!el) {
                setSource(getDocumentScrollElement());
                return;
            }

            setSource(getScrollParent(el) ?? getDocumentScrollElement());
        },
        [sourceProp],
    );

    const ref = useCallback(
        (el) => {
            elementRef.current = el;
            setElement(el);
            resolveFromElement(el);
        },
        [resolveFromElement],
    );

    useLayoutEffect(() => {
        if (sourceProp != null || !element) return;

        resolveFromElement(element);

        const raf = requestAnimationFrame(() => resolveFromElement(element));
        return () => cancelAnimationFrame(raf);
    }, [sourceProp, element, resolveFromElement]);

    useEffect(() => {
        if (sourceProp != null || !element || typeof document === "undefined") return;

        const update = () => resolveFromElement(element);
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;

        ro?.observe(element);

        let node = element.parentElement;
        while (node) {
            ro?.observe(node);
            if (node === document.body || node === document.documentElement) break;
            node = node.parentElement;
        }

        const mo =
            typeof MutationObserver !== "undefined"
                ? new MutationObserver((records) => {
                      const affectsOverflow = records.some(
                          (record) =>
                              record.type === "attributes" &&
                              (record.attributeName === "style" ||
                                  record.attributeName === "class"),
                      );

                      if (affectsOverflow) update();
                  })
                : null;

        if (mo) {
            node = element.parentElement;
            while (node) {
                mo.observe(node, {
                    attributes: true,
                    attributeFilter: ["style", "class"],
                });
                if (node === document.body || node === document.documentElement) break;
                node = node.parentElement;
            }
        }

        return () => {
            ro?.disconnect();
            mo?.disconnect();
        };
    }, [sourceProp, element, resolveFromElement]);

    return { ref, source };
};
