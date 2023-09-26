import * as musicMetadata from "music-metadata-browser";
import AudioCoverInput from "./AudioCoverInput/AudioCoverInput";
import {ChangeEvent, useEffect, useState} from "react";
import {Divider, Input, message, Popconfirm, Select, Steps, Switch, Button} from "antd"
import { InboxOutlined } from '@ant-design/icons'
import Dragger from "./Dragger/Dragger"
import {clientUploadedCover} from "./audioTypes";
import UploadedList from "./UploadedList/UploadedList";

export default function UploadAudio({audioCategories}:{
    audioCategories:{
        name: string,
        id: string,
        image: string,
        categories?: {
            name: string,
            id: string,
            description: string,
            image: string
        }[]
    }[]}
) {
    const [cover, setCover] = useState<clientUploadedCover|null>(null)
    const [currentStep, setCurrentStep] = useState(0)
    const [audioFile, setAudioFile] = useState<File|null>(null)
    const [initCategories, setInitCategories] = useState<{value: string, label:string}[]>([])
    const [initSubCategories, setInitSubCategories] = useState<{value:string, label:string, description?:string}[]>([])
    const [pickedCategory, setPickedCategory] = useState<string>("")
    const [pickedPlaylist, setPickedPlaylist] = useState<string>("")
    const [audioName, setAudioName] = useState<string>("")
    const [playlistPlaceholder, setPlaylistPlaceholder] = useState<string>("")
    const [author, setAuthor] = useState<string>("")
    const [previewToggleEnabled, setPreviewToggleEnabled] = useState<boolean>(false)
    const [preview, setPreview] = useState<boolean>(false)
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

    const parseMetaData = (event:ChangeEvent<HTMLInputElement>) => {
        //todo ограничение по качеству фото
        setCurrentStep(1)
        if (event.target.files && event.target.files[0]) {
            setAudioFile(event.target.files[0])
            console.log(event.target.files[0])
            musicMetadata.parseBlob(event?.target?.files[0]).then(metadata => {
                console.log(metadata)
                if (metadata.common.title) setAudioName(metadata.common.title)
                if (metadata.common.picture) {
                    const blob = new Blob([metadata.common.picture[0].data], {type: metadata.common.picture[0].format})
                    const url = URL.createObjectURL(blob)
                    console.log(url)
                    setCover({mdData: metadata.common.picture[0], url: url})
                }
            })
        }
    }
    const changeCover = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files)
        if (event.target.files && event.target.files[0]) {
            setCover({file:event.target.files[0], url: URL.createObjectURL(event.target.files[0])})
        }
    }
    useEffect(() => {
        let categoriesArr:{value:string, label:string}[] = []
        audioCategories.forEach(x => {categoriesArr.push({value: x.id.toLowerCase(), label: x.name})})
        setInitCategories(categoriesArr)
    }, [audioCategories])
    useEffect(() => {
        if (pickedCategory && author && audioName) setPreviewToggleEnabled(true)
    }, [pickedCategory, pickedPlaylist, author, audioName]);
    const removeFiles = (t:String) => {
        if (!t) return
        if (t === "cover") setCover(null)
        if (t === "audio") setAudioFile(null)
    }
    const filterOptions = (input:string, option: { label: string; value: string }) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    const pickCategory = (e:string) => {
        for (let [index, category] of Object.entries(audioCategories)) {
            if (category.id.toLowerCase() === e){
                let subCatArr:{value:string, label:string, description:string}[] = []
                category.categories?.forEach(x => subCatArr.push({value: x.id, label: x.name, description: x.description}))
                setInitSubCategories(subCatArr)
            }
            setPickedCategory(e)
        }
        // if (initSubCategories.length < 1) setPlaylistPlaceholder("Единый плейлист")
    }
    const unPickCategory = () => {
        setPickedCategory("")
        setInitCategories([])
    }
    const pickPlaylist = (n:string) => {
        setPickedPlaylist(n)
    }
    const unPickPlaylist = () => {
        setPickedPlaylist("")
    }
    const pickAuthor = (n:string) => {
        setAuthor(n)
    }
    const unPickAuthor = () => {
        setAuthor("")
    }
    const togglePreview = (checked:boolean) => {
        setPreview(checked)
        setCurrentStep(2)
    }
    const showPopconfirm = () => {
        setCurrentStep(2)
        setConfirmOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);

        setTimeout(() => {
            setCurrentStep(3)
            setConfirmOpen(false);
            setConfirmLoading(false);
            message.success("Успешно сохранено")
            setTimeout(() => {
                setCurrentStep(0)
                setAudioName("")
                setAuthor("")
                setPlaylistPlaceholder("")
                setInitSubCategories([])
                setPickedCategory("")
                setPickedPlaylist("")
                setAudioFile(null)
                setCover(null)
                setPreviewToggleEnabled(false)
            })
        }, 2000);
    };

    const handleCancel = () => {
        setCurrentStep(1)
        console.log('Clicked cancel button');
        setConfirmOpen(false);
    };
    //todo превью
    return(
        <>
            <div className="h-full min-h-fit">
                {/*{*/}
                {/*    preview? <div className="grid grid-cols-4 gap-4">*/}
                {/*            <div className="p-2">*/}
                {/*                <Steps*/}
                {/*                    direction='vertical'*/}
                {/*                    size="small"*/}
                {/*                    current={currentStep}*/}
                {/*                    items={[*/}
                {/*                        {title: "Загрузите", description: "Загрузите новое аудио"},*/}
                {/*                        {title: "Проверьте и отредактируйте", description: "Проверьте заполненность данных и/или внесите изменения"},*/}
                {/*                        {title: "Отправьте", description: "Отправьте изменения на сервер"}*/}
                {/*                    ]}*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <div className="col-span-3">*/}
                {/*                <div className="flex flex-col items-center justify-center">*/}
                {/*                    <div className="flex justify-between h-20">*/}
                {/*                        <div>*/}
                {/*                            <div className="h-20 rounded">*/}
                {/*                                <img alt="cover" className="h-20 rounded w-20" src={cover?.url} style={{objectFit: "cover"}}/>*/}
                {/*                            </div>*/}
                {/*                            <div>*/}
                {/*                                <span className="text-2xl text-amber-50">{audioName}</span>*/}
                {/*                                <link href={"/"} className="text-gray-300"/>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                        <div></div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        : */}
                {/*}*/}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-2">
                        <Steps
                            direction='vertical'
                            size="small"
                            current={currentStep}
                            items={[
                                {title: "Загрузите", description: "Загрузите новое аудио"},
                                {title: "Проверьте и отредактируйте", description: "Проверьте заполненность данных и/или внесите изменения"},
                                {title: "Отправьте", description: "Отправьте изменения на сервер"}
                            ]}
                        />
                    </div>
                    <div className="col-span-3">
                        <div className="flex">
                            <div className="pr-4">
                                <AudioCoverInput cover={cover} onChange={changeCover}/>
                                {/*@ts-ignore*/}
                                <UploadedList files={[cover?.file || cover?.mdData || null]} type="cover" onRemove={removeFiles}/>
                            </div>
                            <div className="flex-grow p-2">
                                <Divider orientation="left">Название</Divider>
                                <input placeholder={"Введите название композиции"} defaultValue={`${audioName? audioName:""}`} className="rounded bg-footer-dark"/>
                                <Divider orientation="center">Категория</Divider>
                                {/*@ts-ignore*/}
                                <Select size={"large"} onSelect={pickCategory} onClear={unPickCategory} filterOption={filterOptions} showSearch placeholder="Выберите категорию" options={initCategories} optionFilterProp="children" className="text-amber-50 select-wthout-border"/>
                                <Divider orientation="right">Плейлист</Divider>
                                {/*@ts-ignore*/}
                                <Select size={"large"} onSelect={pickPlaylist} onClear={unPickPlaylist} options={initSubCategories} showSearch disabled={!initSubCategories.length} placeholder={`${playlistPlaceholder? playlistPlaceholder:"Выберите плейлист"}`} filterOption={filterOptions} optionFilterProp="children" className="text-amber-50 select-wthout-border"/>
                                <Divider orientation="center">Автор</Divider>
                                {/*@ts-ignore*/}
                                <Select size={"large"} options={[{label: "test", value: "test"}]} onSelect={pickAuthor} onClear={unPickAuthor} showSearch placeholder="Выберите автора" filterOption={filterOptions} optionFilterProp="children" className="text-amber-50 select-wthout-border"/>
                            </div>
                        </div>

                    </div>
                    <div className="col-span-3 ">
                        <Dragger fileType=".mp3" onChange={parseMetaData}>
                            <p className="upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="upload-text">Кликните сюда или перетащите файл для загрузки</p>
                            <p className="upload-hint">
                                Поддерживает только один файл
                            </p>
                        </Dragger>
                        {/*@ts-ignore*/}
                        <UploadedList files={[audioFile]} onRemove={removeFiles} type="audio"/>
                    </div>
                    <div className="grid grid-rows-2">
                        <div className="p-3 row-end-3 max-h-20 flex justify-around rounded">
                            <Popconfirm title={"Сохранение данных"} description={"Добавить аудиозапись в приложение"} open={confirmOpen} onConfirm={handleOk} okButtonProps={{ loading: confirmLoading }} onCancel={handleCancel}>
                                <button disabled={!previewToggleEnabled} className={`${previewToggleEnabled? "bg-sky-700 cursor-pointer hover:bg-sky-800":"bg-sky-900 cursor-not-allowed"} rounded flex items-center h-full`} onClick={showPopconfirm}>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="p-2">Сохранить</p>
                                    </div>
                                </button>
                            </Popconfirm>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}