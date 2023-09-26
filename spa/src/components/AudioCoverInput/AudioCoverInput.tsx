import {PictureOutlined} from "@ant-design/icons"
import Dragger from "../Dragger/Dragger";
import {ChangeEventHandler} from "react";
import {clientUploadedCover} from "../audioTypes";
export default function AudioCoverInput({cover, onChange}:{cover:clientUploadedCover|null, onChange?:ChangeEventHandler<HTMLInputElement>}) {
        return (
            <>
                <div
                    style={{width: "300px", height: "300px"}}
                >
                  <Dragger fileType={".png,.jpeg,.jpg"} onChange={onChange}>
                      {cover? <div className="absolute top-0 left-0"><img src={cover.url} alt="обложка" style={{width: "100%", height: "297px", objectFit: "cover", zIndex: 1}}/></div>
                      :  <div>
                              <p className="upload-drag-icon">
                                  <PictureOutlined />
                              </p>
                              <p className="upload-text">Загрузите обложку</p>
                              <p className="upload-hint">
                                  При загрузке аудио, попытаемся извлечь обложку из метаданных
                              </p>
                          </div>
                      }
                  </Dragger>
                </div>
            </>
        )
}