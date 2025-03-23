import s from './VideoPlayer.module.scss'
import axios from 'axios'
import { useRef, useEffect, useState } from "react";
import {FaPlay,FaPause} from "react-icons/fa6"
import { motion,AnimatePresence} from 'framer-motion';
import { Oval } from 'react-loader-spinner'
import { RiForward15Line,RiReplay15Fill} from "react-icons/ri";
import { GoMute,GoUnmute } from "react-icons/go";

const VideoPlayer = ({roomData,socket,roomId,isReady,handleLoading}) => {

const [videoUrl,setVideoUrl] = useState(null)
const [videoIsPlay,setVideoIsPlay] = useState(false)
const [hideControl,setHideControl] = useState(false)
const [currentTime, setCurrentTime] = useState(0);
const [loading,setLoading] = useState(false)
const [duration, setDuration] = useState(0);
const [mute,setMute] = useState(false)

const token = sessionStorage.getItem('__authToken');

const videoRef = useRef(null);

const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id 


const fetchVideo = async () => {
  if (!roomData?.videoLink) return;

  const videoUrl = `${process.env.REACT_APP_API_URL}/api/video/${roomData.videoLink}`;

  try {
    const response = await axios.get(videoUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Range: "bytes=0-", 
      },
      responseType: "blob",
    });


    const videoBlob = response.data;
    const videoObjectUrl = URL.createObjectURL(videoBlob);

    videoRef.current.src = videoObjectUrl;
    videoRef.current.load();
    handleLoading();
  } catch (error) {
    console.error("Ошибка при загрузке видео:", error);
  }
};

useEffect(() => {
  fetchVideo();
}, [roomData?.videoLink]);

  const handleVideoControl = (action) => {
  const player = videoRef.current;
  if (!player) return;

  const currentTimeVideo = videoRef.current?.currentTime;
  console.log(videoRef.current.currentTime)

  socket.emit('youtubeControl', { roomId, action, currentTime:currentTimeVideo });

};

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateTime = () => setCurrentTime(video.currentTime);
      

      video.addEventListener("timeupdate", updateTime);

  if(videoRef.current.currentTime >= videoRef.current.duration){
    console.log(videoRef.current.currentTime,videoRef.current.duration)
    videoRef.current.currentTime = 0
    setVideoIsPlay(false)
    videoRef.current.pause()
  }

  const handleWaiting = () => setLoading(true);
  const handleCanPlay = () => setLoading(false);

  video.addEventListener("waiting", handleWaiting);
  video.addEventListener("canplay", handleCanPlay);


      return () => { 
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("timeupdate", updateTime);

      setDuration(video.duration);
    }
  
  }


  }, [videoRef?.current?.duration,videoRef?.current?.currentTime]);

const timerRef = useRef()


useEffect(() => {
  const player = videoRef.current;
  if (!player) {
    console.error("Player reference is not available.");
    return;
  }



  if (isReady) {
    let syncInterval;

    const syncVideo = () => {
      const currentTimeVideo = player.currentTime;
      socket.emit("youtubeControl", {
        roomId,
        action: "play",
        currentTime:currentTimeVideo,
      });
    };

    console.log(
      `YouTubeControl received: action=${roomData?.videoSettings?.action}, currentTime=${roomData?.videoSettings?.currentTime}`
    );


    switch (roomData?.videoSettings?.action) {
      case "play":
          player.currentTime = roomData?.videoSettings?.currentTime;
          setVideoIsPlay(true)
          player.play(); 
        
 
        if (roomData?.owner === thisUserId) {
          syncInterval = setInterval(syncVideo, 3000);
        }
        break;

      case "pause":
         player.currentTime = roomData?.videoSettings?.currentTime;
         setVideoIsPlay(false)
         player.pause();
          
        break;

      case "seek":
        player.currentTime = roomData?.videoSettings?.currentTime;
        player.play()
        break;

      case "end":
        player.stop();
        break;

      default:
        console.error("Unknown action:", roomData?.videoSettings?.action);
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }
}, [roomData?.videoSettings?.action, isReady]);


  const handlePlay = () => {
    if(roomData?.owner !== thisUserId){
      return
    }

    if (videoRef.current && !videoIsPlay) {
      handleVideoControl("play")
      setHideControl(false)
      videoRef.current.play();
      setVideoIsPlay(true)
      timerRef.current = setTimeout(()=>{setHideControl(true)},2500)
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");

    } 
  };

  const handlePuase = () => {
    if(roomData?.owner !== thisUserId){
      return
    }
    clearTimeout(timerRef.current)
    setHideControl(false)
if (videoRef.current && videoIsPlay) {
      handleVideoControl("pause")
      videoRef.current.pause();
      setVideoIsPlay(false)
      
    }
  }

  const hnadleMuteUnmute = () => {
    if(mute){
      setMute(false)
      videoRef.current.muted = false
    } else {
      setMute(true)
      videoRef.current.muted = true
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
  console.log("loaded")
    setDuration(videoRef.current.duration);
  };


const timerSeekRef = useRef()

const handleProgressClick = (e) => {
  clearTimeout(timerSeekRef.current);
  
  const video = videoRef.current;
  if (!video) return;

  const progressBar = e.currentTarget;
  const clickX = e.nativeEvent.offsetX;
  const progressWidth = progressBar.clientWidth;
  const newTime = (clickX / progressWidth) * video.duration;

  if (video.readyState >= 2) { 
    setLoading(true); 

    video.currentTime = newTime;
    setCurrentTime(newTime);
    handleVideoControl("seek");

    timerSeekRef.current = setTimeout(() => {
      handleVideoControl("play");
      setLoading(false); 
    }, 50);
  } else {
    console.log("Видео ещё не загружено, ждем...");
  }
};
const formatTime = (time) => {
  if (!time || isNaN(time)) return "00:00"; 
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const timerPrevRef = useRef()

const prevHandle = () => {
  setLoading(true)
  clearTimeout(timerPrevRef.current)
  videoRef.current.currentTime = videoRef.current.currentTime - 15
  handleVideoControl("seek")
  timerPrevRef.current = setTimeout(()=>{
    setLoading(false)
    handleVideoControl("play")
  },20)
}

const timerNextRef = useRef()

const nextHandle = () => {
  setLoading(true)
  clearTimeout(timerNextRef.current)
  videoRef.current.currentTime = videoRef.current.currentTime + 15
  handleVideoControl("seek")
  timerNextRef.current = setTimeout(()=>{
    setLoading(false)
    handleVideoControl("play")
  },20)
}


	return (
		  <div className={s.videoContainer}>
          <video 
          ref={videoRef} 
          onClick={visibilityControl}  
          preload="auto" 
          controlsList="nofullscreen" 
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setLoading(true)}
          onCanPlay={()=> setLoading(false)}
          playsInline 
          webkit-playsinline />
          <AnimatePresence>
          {(hideControl === false) && thisUserId === roomData?.owner && !loading &&
          <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1  }}
          exit={{opacity:0}}
          transition={{ duration: 0.2 }}
          className={s.controlContent}>
          <div className={s.cBlock1}></div>
          <div className={s.cBlock2}>
           {loading  &&
            <Oval visible={true}  height="40"  width="40"  color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/> }
           {!videoIsPlay && !loading && 
           <motion.button
          initial={{ opacity: 0 , scale: 0.7 }}
          animate={{ opacity: 1 ,  scale: 1  }}
          transition={{ duration: 0.2 }}
            className={s.playBtn} disabled={loading && true} onClick={handlePlay}>
           <FaPlay/>
           </motion.button>}
          {videoIsPlay && !loading && 
        <motion.div 
          initial={{ opacity: 0 , scale: 0.7 }}
          animate={{ opacity: 1 ,  scale: 1  }}
          transition={{ duration: 0.2 }}       
        className={s.controlItem}>
            <span className={s.seek} onClick={prevHandle}><RiReplay15Fill/></span>
              <button className={s.pauseBtn} onClick={handlePuase}><FaPause/></button>
            <span className={s.seek} onClick={nextHandle}><RiForward15Line/></span>
            </motion.div>}
            </div>
            <motion.div 
          initial={{ opacity: 0 , y:50}}
          animate={{ opacity: 1 , y:0 }}
          transition={{ duration: 0.2 }} 
            className={s.cBlock3}>
              <span className={s.cItem1}>
           {!videoIsPlay ? <button className={s.playBtn} onClick={handlePlay}><FaPlay/></button>
            : 
              <button className={s.pauseBtn} onClick={handlePuase}><FaPause/></button>
            }
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
              <span className={s.cItem3} onClick={hnadleMuteUnmute}>{mute ? <GoMute/> : <GoUnmute/> }</span>
            </motion.div>
          </motion.div>}
          </AnimatePresence>
        	</div>
		)
}

export default VideoPlayer