import Ds from "../DesignSystem";
import { SYS } from "../../constants/SYS";
import { Flex } from "../Flex";
import { GoogleMapViewer } from ".";

const SAMPLE_PB =
    "!1m17!1m12!1m3!1d1133.694039040681!2d40.23570134144272!3d37.91067108076305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzfCsDU0JzM5LjYiTiA0MMKwMTQnMTIuNCJF!5e0!3m2!1sen!2sgr!4v1785012948463!5m2!1sen!2sgr";

const X = () => (
    <Ds.page
        title="<GoogleMapViewer>"
        releasedOn="1.0.0"
        description={{ tr: "pb değerinden (pb= sonrasındaki, başındaki ! dahil bölüm) bir Google Maps embed iframe'i render eder.", en: "Renders a Google Maps embed iframe from a pb value (the segment after pb=, including the leading !)." }}
    >
        <Ds.block
            title={{ tr: "Temel Kullanım", en: "Basic Usage" }}
            code={`import { GoogleMapViewer } from "${SYS.basePath}";

                        <GoogleMapViewer pb={content.googleMapsLinkPb} />`}
            example={
                <Flex padding={10} full>
                    <GoogleMapViewer pb={SAMPLE_PB} w="100%" h={320} />
                </Flex>
            }
        />
        <Ds.block
            title={{ tr: "Özel Boyut", en: "Custom Size" }}
            description={{ tr: "w ve h; sayıları (→ rem) veya CSS boyut string'lerini kabul eder. Varsayılanlar Google'ın embed varsayılanlarıyla aynıdır (600 × 450).", en: "w and h accept numbers (→ rem) or CSS size strings. Defaults match Google's embed defaults (600 × 450)." }}
            code={`import { GoogleMapViewer } from "${SYS.basePath}";

                        <GoogleMapViewer pb={pb} w={600} h={450} />
                        <GoogleMapViewer pb={pb} w="100%" h={280} />`}
            example={
                <Flex gap={16} wrap padding={10} full>
                    <GoogleMapViewer pb={SAMPLE_PB} w={320} h={240} />
                    <GoogleMapViewer pb={SAMPLE_PB} w="100%" h={280} />
                </Flex>
            }
        />
        <Ds.api
            args="<GoogleMapViewer pb={string} />"
            props={{
                pb: {
                    description:
                        "Required. Maps embed pb value including the leading !. Missing/empty → null. Full embed URLs and pb=… strings are also accepted and normalized.",
                    type: "string",
                    required: true,
                },
                w: {
                    description: { tr: "Iframe genişliği. Sayı → rem; string → CSS boyutu.", en: "Iframe width. Number → rem; string → CSS size." },
                    type: "number | string",
                    defaultValue: "600",
                },
                h: {
                    description: { tr: "Iframe yüksekliği. Sayı → rem; string → CSS boyutu.", en: "Iframe height. Number → rem; string → CSS size." },
                    type: "number | string",
                    defaultValue: "450",
                },
                title: {
                    description: { tr: "Erişilebilir iframe başlığı.", en: "Accessible iframe title." },
                    type: "string",
                    defaultValue: '"Google Map"',
                },
            }}
        />
    </Ds.page>
);

export default X;
