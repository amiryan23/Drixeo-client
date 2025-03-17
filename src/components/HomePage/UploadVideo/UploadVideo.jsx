import s from './UploadVideo.module.scss'
import { Oval } from 'react-loader-spinner'
import { IoLockClosed } from "react-icons/io5";
import { GoUpload } from "react-icons/go";
import axios from 'axios'
import { useRef, useEffect, useState } from "react";
import {FaPlay,FaPause} from "react-icons/fa6"

const UploadVideo = ({loadingVideo,setLoadingVideo,videoUrl,setVideoUrl,videoLink,setIsDisabled,savedLink}) => {

const [videoIsPlay,setVideoIsPlay] = useState(false)
const [hideControl,setHideControl] = useState(false)
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [uploadedMB, setUploadedMB] = useState(0);
  const [totalMB, setTotalMB] = useState(0);

const token = sessionStorage.getItem('__authToken');


const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      

      video.addEventListener("timeupdate", updateTime);
      return () => video.removeEventListener("timeupdate", updateTime);

      setDuration(video.duration);
  
  }


  }, [videoRef?.current?.duration]);

const handleUploadVideo = async (event) => {
  setLoadingVideo(true);
  const file = event.target.files[0];
  if (!file) return;

    const MAX_FILE_SIZE_MB = 500;
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    alert("Файл слишком большой! Максимальный размер 500MB.");
    setLoadingVideo(false);
    return;
  }

  const formData = new FormData();
  formData.append("video", file);

  setTotalMB((file.size / (1024 * 1024)).toFixed(2));

  try {
    const uploadResponse = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
          setUploadedMB((progressEvent.loaded / (1024 * 1024)).toFixed(2));
        },
      }
    );

    // Получаем URL загруженного видео сразу из ответа сервера
    const videoUrl = uploadResponse.data.videoUrl;

    // Сохраняем ID файла в sessionStorage (если нужно)
    sessionStorage.setItem('__fileId', videoUrl);

    // Устанавливаем видео
    setVideoUrl(videoUrl);
    setLoadingVideo(false);
    setIsDisabled(false)

    console.log("Видео загружено:", videoUrl);
  } catch (error) {
    setLoadingVideo(false);
    setIsDisabled(true)
    console.error("Ошибка при загрузке видео:", error);
  }
};

const timerRef = useRef()

  const handlePlay = () => {
    console.log(videoRef.current.duration)
    if (videoRef.current && !videoIsPlay) {
      setHideControl(false)
      videoRef.current.play();
      setVideoIsPlay(true)
      timerRef.current = setTimeout(()=>{setHideControl(true)},2500)

    } 
  };

  const handlePuase = () => {
    clearTimeout(timerRef.current)
    setHideControl(false)
if (videoRef.current && videoIsPlay) {
      videoRef.current.pause();
      setVideoIsPlay(false)
      
    }
  }

  const visibilityControl = () => {
    clearTimeout(timerRef.current)
    setHideControl(false)
    if(videoRef.current && videoIsPlay){
      timerRef.current = setTimeout(()=>{setHideControl(true)},2500)
    }
  }

 const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };


  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickX = e.nativeEvent.offsetX;
    const progressWidth = progressBar.clientWidth;
    const newTime = (clickX / progressWidth) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

const formatTime = (time) => {
  if (!time || isNaN(time)) return "00:00"; 
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};


const handleDeleteVideo = async () => {
  setIsDisabled(true)
  setLoadingVideo(true)
  if (!videoUrl) return;

  const filename = videoUrl.split("/").pop();

  try {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/delete/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoadingVideo(false)
    setVideoUrl(null);
    console.log("Видео удалено!");
  } catch (error) {
    setLoadingVideo(false)
    console.error("Ошибка при удалении видео:", error);
  }
};

	return (
		<>
		{!videoUrl  ? <label htmlFor="uploadVideo" className={(!videoLink || !savedLink)  ? `${s.uploadBlock} ${s.active} `: s.uploadBlock}>{loadingVideo 
					? 			
				<>	<Oval
  			visible={true}
  			height="20"
  			width="20"
  			color="whitesmoke"
  			ariaLabel="oval-loading"
 			wrapperStyle={{}}
  			wrapperClass=""
 			 /> 
        <br/><p>{uploadedMB} MB / {totalMB} MB ({progress}%)</p>
       </> :
       (videoLink || savedLink) ? <IoLockClosed/> : <span className={s.upload}><GoUpload/>Upload Video (to 500 MB)<span>(to 1 GB for premium users)</span></span>
     }</label>
					:<div className={s.videoContainer}>
          <video ref={videoRef} onClick={visibilityControl}  preload="metadata" controlsList="nofullscreen" playsInline webkit-playsinline>
          <source src={videoUrl} type="video/mp4"></source>
          <source src={videoUrl} type="video/ogg"></source>
          </video>
          {(hideControl === false) && <div className={s.controlContent}>
          <div className={s.cBlock1}></div>
          <div className={s.cBlock2}>
           {!videoIsPlay ? <button className={s.playBtn} onClick={handlePlay}><FaPlay/></button>
            : <button className={s.pauseBtn} onClick={handlePuase}><FaPause/></button>}
            </div>
            <div className={s.cBlock3}>
              <span className={s.cItem1}>
           {!videoIsPlay ? <button className={s.playBtn} onClick={handlePlay}><FaPlay/></button>
            : <button className={s.pauseBtn} onClick={handlePuase}><FaPause/></button>}
              </span>
              <span className={s.cItem2}>
               <span className={s.cMiniItem1}>
                 <span className={s.timeItem1}>{formatTime(currentTime)}</span>
                 <span className={s.timeItem2}>{formatTime(videoRef?.current?.duration)}</span>
               </span>
               <span className={s.cMiniItem2} onClick={handleProgressClick}>
                 <div className={s.progressDuration} style={{width:`${(currentTime/videoRef?.current?.duration) * 100}%`}}></div>
               </span>
            </span>
              <span className={s.cItem3}>M</span>
            </div>
          </div>}
        	</div>}
          {videoUrl && <button className={s.delVdBtn} onClick={handleDeleteVideo}>
          {loadingVideo 
          ?       
        <>  <Oval
        visible={true}
        height="15"
        width="15"
        color="whitesmoke"
        ariaLabel="oval-loading"
      wrapperStyle={{}}
        wrapperClass=""
       />
       </>
       : "Delete"}
          </button>}
      	<input id="uploadVideo" type="file" accept="video/*" disabled={(videoLink || savedLink) && true} onChange={handleUploadVideo} style={{display:"none"}} />		
		</>
		)
}

export default UploadVideo