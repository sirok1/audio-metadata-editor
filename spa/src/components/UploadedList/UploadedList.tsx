import {pictureFromMetadata} from "../audioTypes";
import {FileOutlined, DeleteOutlined} from "@ant-design/icons"
export default function UploadedList({onRemove, files, type}:{onRemove?:(t?:string) => void, files:(File[]|pictureFromMetadata[]|[null]), type?:string}) {
    return (
        <>
            {files?.length &&
                files.map((f, index) =>
                    f &&
                    <span key={index} className="inline-flex justify-between p-2 rounded border border-b-emerald-50">
                        <span>
                            <FileOutlined />
                            <span className="pl-2 pr-4">{"name" in f? `${f.name}`:`${f.format.replace(/\//g, ".")}` }</span>
                        </span>
                        <button onClick={onRemove? () => onRemove(type) : () => console.log("")} className="trash-bth">
                            <DeleteOutlined />
                        </button>
                    </span>
                )
            }

        </>
    )
}