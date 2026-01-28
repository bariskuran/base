/* eslint-disable no-unused-vars */
import { V1 } from "./versions/V1";
import { FORM } from "../../FORM";
// import { Icon } from "../../Icon";
import { useDS } from "../../useDashStore";
// import { Upload as UploadOrj } from "antd";
import { addToNotifier } from "../../addToNotifier";
// import { ImageCropper } from "./ImageCropper";
// const { Dragger } = UploadOrj;

const allowed = ["jpg", "jpeg", "png", "gif"];
const versions = { V1 };

export const FieldUploadImage = ({ form, ...rest }) => (
    <FORM.field form={[UploadImage, "uploadFile", form?.[0], form?.[1]]} {...rest} />
);

export const UploadImage = (props = {}) => {
    const { set, reset, ...state } = useDS({});
    const { fieldVersion, value, inputProps, fieldRef, onChange, onClick } = props;
    const {
        maxCount = 1,
        allowedFileTypes = allowed,
        allowedFileSize = 1, // mb
        allowedRatio, // if null, square is free. Its format is [width, height] such as [3,1]
        allowCrop = allowedRatio ? true : false,
        ...restInputProps
    } = inputProps || {};

    /* Handle Change */
    const handleChange = ({ fileList }) => {
        if (fileList.length > maxCount) {
            addToNotifier({
                info: `More files have been uploaded than expected. Only ${maxCount} ${maxCount > 1 ? "files are" : "file is"} being processed.`,
                status: "notr",
            });
        }

        const newFileList = fileList.slice(0, maxCount);
        let fault = false;

        newFileList.forEach((it) => {
            const { name, size, type } = it || {};
            if (!name || !size || !type) {
                addToNotifier({ info: `Unexpected file: ${name}`, status: "error" });
                fault = true;
                return;
            }
            const splittedType = type.split("/")?.[1] || "unknown type";
            if (!allowedFileTypes.includes(splittedType)) {
                addToNotifier({ info: `Unexpected type for ${name}`, status: "error" });
                fault = true;
                return;
            }
        });

        if (fault) clearValue();
        else if (allowCrop) set({ previewList: newFileList });
        else onChange(newFileList);
    };

    const clearValue = () => {
        reset({});
        onChange(null);
    };

    /* Return */
    const Version = versions?.[fieldVersion] || versions.V1;
    return (
        <Version $showList={value?.length > 0}>
            NOT FINISHED.
            {/* <ImageCropper {...{ ...state, set, allowedFileSize, clearValue, allowedRatio }} />
            <Dragger
                listType="picture"
                ref={fieldRef}
                fileList={value || []}
                accept={allowedFileTypes}
                multiple={maxCount > 1}
                beforeUpload={() => false} // this kills autoUpload to the server.
                onChange={handleChange}
                {...{ ...restInputProps, maxCount, onClick }}
            >
                {(!value || value.length < 1) && (
                    <div id="addArea">
                        <Icon icon="plus" width={16} />
                        <span>Click or drag {maxCount > 1 ? "images" : "image"}</span>
                    </div>
                )}
            </Dragger> */}
        </Version>
    );
};

/*

            // if (size > allowedFileSize * 1024 * 1024) {
            //     addToNotifier({
            //         info: `${name} is bigger than ${allowedFileSize}MB.`,
            //         status: "error",
            //     });
            //     fault = true;
            //     return;
            // }

*/
