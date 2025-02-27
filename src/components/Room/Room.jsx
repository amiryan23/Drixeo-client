import s from './Room.module.scss'
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import React,{useState,useEffect,useContext,useRef,useCallback } from 'react'
import { MyContext } from './../../context/Context'
import io from 'socket.io-client';
import { FaUser,FaCircleArrowUp,FaCheck } from "react-icons/fa6";
import { motion,AnimatePresence} from 'framer-motion';
import YouTube from 'react-youtube';
import { GiExitDoor } from "react-icons/gi";
import { ToastContainer, toast ,Flip } from 'react-toastify';
import { IoSettingsOutline , IoCloseCircle } from "react-icons/io5";
import { FaCircle , FaShareSquare , FaReply , FaCopy } from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";
import Sparkle from 'react-sparkle'
import { TiStarFullOutline } from "react-icons/ti";
import { FiGift } from "react-icons/fi";
import GiftModal from './GiftModal/GiftModal'
import GiftSettings from './../HomePage/UserModal/GiftSettings/GiftSettings'
import UserModal from './../HomePage/UserModal/UserModal'
import { useTranslation } from 'react-i18next';
import UserLevelInfo from './UserLevelInfo/UserLevelInfo.jsx'
import {calculateLevelChat,calculateLevel} from './../../helpers/calculateLevel.js'
import {decryptData} from './../../helpers/decryptData'
import { MdDelete } from "react-icons/md";
import DeleteModal from './DeleteModal/DeleteModal'
import {getMessageStyle} from './../../helpers/getMessageStyle'
import {extractVideoId} from './../../helpers/extractVideoId'
import ReadyModal from './ReadyModal/ReadyModal'
import ExitModal from './ExitModal/ExitModal'
import UserInfo from './UserInfo/UserInfo'
import PremiumModal from './PremiumModal/PremiumModal'
import {getStyleLevel} from './../../helpers/getMessageStyle'
import YouTubeSearch from './../HomePage/YouTubeSearch/YouTubeSearch'
import { FaSearch } from "react-icons/fa";




const Room = () => {
  const { roomId } = useParams();

    const [roomData, setRoomData] = useState({
    owner: '',
    members: [],
    videoLink: '',
    blocked: [],
    limit: 0,
    chatRoom:[]
  });
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [textActive,setTextActive] = useState(false)
  const [isReady, setIsReady] = useState(false);
  const [readyVideo,setReadyVideo] = useState(0)
  const [exitModal,setExitModal] = useState(false)
  const [openSettings,setOpenSettings] = useState(false)
  const [linkChanged,setLinkChanged] = useState(false)
  const [newVideoId,setNewVideoId] = useState(null)
  const [userInfo,setUserInfo] = useState(null)
  const [infoState,setInfoState] = useState("gifts")
  const [premiumModal,setPremiumModal] = useState(false)
  const [openGiftModal,setOpenGiftModal] = useState(false)
  const [loading,setLoading] = useState(false)
  const [openGift,setOpenGift] = useState(null)
  const [openUserModal,setOpenUserModal] = useState(false)
  const [deleteModal,setDeleteModal] = useState(false)
  const [longPressTriggered, setLongPressTriggered] = useState(null);
  const [replyMsg,setReplyMsg] = useState(null)
  const [scroll,setScroll] = useState(true)
  const [isDisabled,setIsDisabled] = useState(true)
  const [lastGift,setLastGift] = useState(null)
  const [lastGiftOpenModal,setLastGiftOpenModal] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [openSearchModal,setOpenSearchModal] = useState(false)
  const [lastTap,setLastTap] = useState(0)
  

  const {  thisUser  } = useContext(MyContext);

    const { t } = useTranslation();

  const token = sessionStorage.getItem('__authToken');


  const chatContainerRef = useRef(null);
  const playerRef = useRef(null)
  const prevVideoLink = useRef(roomData?.videoLink);
  const textAreaRef = useRef()


const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

useEffect(() => {
  if (!token) return;

  const newSocket = io(process.env.REACT_APP_API_URL , {
    query: { token },
  });
  setSocket(newSocket);

  if(!roomData?.blocked.includes(thisUserId)){
  newSocket.emit('joinRoom', { roomId, userId: thisUserId });
  }

  newSocket.on('roomUpdated', (data) => {
  const decryptRoomData = decryptData(data.encryptedData,process.env.REACT_APP_SECRET_KEY_CODE)
    setRoomData(decryptRoomData);

  if (decryptRoomData.videoLink !== prevVideoLink.current) {
    setIsReady(false);
    prevVideoLink.current = decryptRoomData.videoLink
  } 
  });

const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      newSocket.emit('leaveRoom', { roomId, userId: thisUserId });
    } else if (document.visibilityState === 'visible') {
      
      newSocket.emit('joinRoom', { roomId, userId: thisUserId });
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);


  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    newSocket.disconnect();
  };
}, [roomId, thisUserId , token]);


const handleSendMessage = () => {
    setScroll(true)
    if (message.trim() !== '') {
      const messageData = {
        userId:thisUserId,
        text: message,
        roomId:roomId,
        reply:replyMsg || null
      };
      socket.emit('sendMessage', messageData);
      textAreaRef.current.value = '';
      setMessage('');  
      setTextActive(false)
      setReplyMsg(null)
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    }
  };

const deleteMessage = () => {
  setScroll(false)
  socket.emit('deleteMessage', { roomId, messageId:longPressTriggered }, (response) => {
    if (response.success) {
      console.log(`Message with ID ${longPressTriggered} successfully marked as deleted.`);
    } else {
      console.error('Error deleting message:', response.error);
    }
  });
  setLongPressTriggered(null)
};
  

  const giftArray = roomData?.chatRoom?.filter(chat => chat?.giftImg !== undefined).map(gift => gift)

  const lastGiftIndex = giftArray?.length - 1

  let timerCloseRoom;

  const lastGiftTimer = useRef()


useEffect(() => {

if (lastGift?.id !== giftArray[lastGiftIndex]?.id) {
  setLastGift(giftArray[lastGiftIndex]); 
  setLastGiftOpenModal(true);
  clearTimeout(lastGiftTimer.current);  
  lastGiftTimer.current = setTimeout(() => {
    setLastGiftOpenModal(false);
  }, 5000);
} 

if (roomData?.members.length > roomData?.limit) {
      const exceededUserId = roomData.members[roomData?.limit];

     if (thisUserId === exceededUserId) {
        window.location.href = "/"
    }
  }
    
    if(roomData?.blocked.includes(thisUserId)){
      window.location.href = "/"
    }

    if(roomData?.closed){
      toast.warn("This Room Deleted From Owner")
     timerCloseRoom = setTimeout(()=>{ window.location.href = "/" },1000)
    }

    if (chatContainerRef.current && longPressTriggered === null && scroll) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }

    return () => {
      clearTimeout(timerCloseRoom)
    }
  }, [roomData?.blocked,roomData?.chatRoom,giftArray]);


useEffect(() => {

  const player = playerRef.current;

  if (!player) {
    console.error('Player reference is not available.');
    return;
  }

  if (isReady) {
    let syncInterval; 

    const syncVideo = () => {
      const currentTime = player.getCurrentTime(); 
      socket.emit('youtubeControl', { 
        roomId, 
        action: 'play', 
        currentTime 
      });
    };

  console.log(
    `YouTubeControl received: action=${roomData?.videoSettings?.action}, currentTime=${roomData?.videoSettings?.currentTime}`
  );


    switch (roomData?.videoSettings?.action) {
      case 'play':
        player.seekTo(roomData?.videoSettings?.currentTime, true);
        player.playVideo();

        if (roomData?.owner === thisUserId) {
          syncInterval = setInterval(syncVideo, 3000);
        }
        break;

      case 'pause':
        player.seekTo(roomData?.videoSettings?.currentTime, true); 
        player.pauseVideo(); 
        break;

      case 'seek':
        player.seekTo(roomData?.videoSettings?.currentTime, true); 
        break;

      case 'end':
        player.stopVideo(); 
        break;

      default:
        console.error('Unknown action:', roomData?.videoSettings?.action);
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval);
    };
  }
}, [roomData?.videoSettings?.action, isReady]); 


const handleVideoControl = (action) => {
  const player = playerRef.current;
  if (!player) return;

  const currentTime = player?.getCurrentTime();

  socket.emit('youtubeControl', { roomId, action, currentTime });

};


const handleReadyClick = () => {
  const player = playerRef.current;
  if (player && roomData?.videoLink) {
    player.playVideo();
    
    if (roomData?.videoSettings?.action !== "play") {
      setTimeout(() => {
        player.pauseVideo();
      }, 300); 
    }

    setIsReady(true);
  }
};

const handleVideoIdChange = () => {
    socket.emit("videoIdUpdated", { roomId, newVideoId });
    setLinkChanged(true);
    setIsDisabled(true)
    setTimeout(() => {
      setOpenSettings(false)
      setLinkChanged(false);
      setNewVideoId(null)

    }, 500);
  };

const toggleUserBlock = (roomId, userId) => {
  
  if(thisUserId === roomData?.owner){
  socket.emit("userBlockedUpdated", { roomId, userId });
  if(!roomData?.blocked.includes(userId)){
    toast.success(t('User successfully blocked'))
  } else {
    toast.success(t('User successfully unblocked'))
  }
  }

  console.log(`Requested block/unblock for user ${userId} in room ${roomId}`);
};


  const JoinedUsers = roomData 
  ? roomData?.users?.map(user=> 
    <div className={s.userContainer}>
      <img src={user?.photo_url} alt=""/>
      <span className={s.userContent2}>{user?.first_name}</span>
      <span className={s.userContent3}>
      {user.userId !== roomData?.owner ?
      <>
      <button className={roomData.blocked.includes(user.userId) ? s.unBlockBtn : s.btn1} onClick={()=>{toggleUserBlock(roomId,user?.userId)}}>{roomData.blocked.includes(user.userId) ? t("Unblock") : t("Block")}</button>
      <button disabled={user?.status !== 'online' && true} className={s.btn2} onClick={()=>{assignOwner(user?.userId)}}>{t("Asign as owner")}</button>
      </>
      : <span className={s.owner}>{t("Owner")}</span>}
      </span>
      <span className={s.userContent4}><FaCircle size="9" color={user?.status === 'online' ? "#7CFC00" : "#999"}/></span>
    </div>) 
  : "Loading"




const assignOwner = (userId) => {
  socket.emit('assignOwner', { roomId: roomId, userId });
  setOpenSettings(false)
};

const handleOpenSettings = () => {
  setOpenSettings(true) 
  setReplyMsg(null)
}

async function openInvoice(months, price) {
  setLoading(true)
  window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");

  if(thisUser?.isAdmin === 1){
          socket.emit("giftPremiumAdmin", { senderId:thisUserId, receiverId:userInfo, months, roomId , price })
          setPremiumModal(false)
          setLoading(false)
      toast(t('Premium successfully gifted to user'),{
        icon:<RiVipCrownFill size="25" color="#0088cc" />
      });
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success"); 
  }
  else{
  try {
    
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/create-invoice`, {
      months,
      price,
    },
    { headers: {
      'Authorization': `Bearer ${token}`
      }
      });

    const { invoiceLink } = response.data;

    window.Telegram.WebApp.openInvoice(invoiceLink, async (status) => {


      if (status === "paid") {
        try {
          socket.emit("giftPremium", { senderId:thisUserId, receiverId:userInfo, months, roomId , price })
          setPremiumModal(false)
          setLoading(false)
      toast(t('Premium successfully gifted to user'),{
        icon:<RiVipCrownFill size="25" color="#0088cc" />
      });
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");         
        } catch (error) {
          console.error("Ошибка при обновлении данных пользователя:", error);
          alert("Не удалось обновить премиум-подписку.");
          setLoading(false)
        }      
      } else if (status === "cancelled") {
        setLoading(false)
        console.log("cancelled")
        
      } else if (status === "pending") {
      
        alert("WAIT")
      } else if (status === "failed"){

        alert("FAILED")
      }
    });
  } catch (error) {
    console.error("Ошибка при открытии счет-фактуры:", error);
    alert(error)
    setLoading(false)
  }
}
}


const handleToggleVisibility = async (isPublic) => {
    if (isCooldown) {
    toast.warn(t('Too often, please wait a few seconds'));
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    return;
  }

    try {
      setIsCooldown(true)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/rooms/update-room-visibility`, {
        roomId: roomData.roomId,
        is_public: isPublic,
      },
      { headers: {
        'Authorization': `Bearer ${token}`
      }
      });

      if (response.data.success) {
        if(isPublic){
        toast(t('The room is now public'))
      } else {toast(t('The room is now private'))}
        setRoomData((prev) => ({
          ...prev,
          is_public: isPublic,
        }));
      } else {
        console.error('Failed to update room visibility');
      }
    } catch (error) {
      console.error('Error updating room visibility:', error);
    } finally {
    setTimeout(() => {
      setIsCooldown(false);
    }, 5000);
  }
  };


const handleLongPress = (index) => {
    setLongPressTriggered(index);
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  };

  const longPressTimer = useRef(null);

const handlePressStart = (index) => {
    longPressTimer.current = setTimeout(()=>{handleLongPress(index)}, 500); 
  }; 

const handlePressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

let typingTimeout;

const chatScrollTimerRef = useRef(null);

const handleScrollChatStart = () => {
  clearTimeout(chatScrollTimerRef.current);
  setScroll(false)
    chatScrollTimerRef.current = setTimeout(() => {
      setScroll(true);
    }, 10000);
  
}

const handleInputChange = (e) => {
    const link = e.target.value;
    setNewVideoId(link);

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(link)) {
      setIsDisabled(false); 
    } else {
      setIsDisabled(true); 
    }
  };


const handleLoading = useCallback(() => {
  setTimeout(()=>{setReadyVideo((prevReadyVideo)=>prevReadyVideo + 25)},6000)
         if(roomData?.owner !== ''  && readyVideo < 100){
  setReadyVideo((prevReadyVideo)=>prevReadyVideo + 50)
}
},[roomData?.owner])

 return (
    <div className={s.megaContainer}>
    <ReadyModal isReady={isReady} handleReadyClick={handleReadyClick} readyVideo={readyVideo} t={t} />
      <div className={s.content1}>
        <span className={s.item1}>
        {t("Room")}:{roomData?.roomId}
        <Link to={`https://t.me/share/url?url=${`https://t.me/drixeo_bot/app?startapp=${roomId}`}&text=${`${t("Hello! Watch with us. Room")} ${roomId}`}`} 
        onClick={()=>{window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");}}><FaShareSquare/></Link>
        </span>
        <span onClick={()=>{
          setExitModal(true)
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("warning");
        }}  className={s.item2}><GiExitDoor/></span>
      </div>
      <div className={s.content2} 
      onClick={()=>{
        if(roomData?.owner !== window.Telegram.WebApp?.initDataUnsafe?.user?.id ){
         toast.error(t('Only the owner can control the video'))
         window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
       } 
      }}
      >
      <YouTube
        videoId={extractVideoId(roomData?.videoLink)} 
        ref={playerRef}
        onReady={(event) => {
          playerRef.current = event.target;
          handleLoading()
        }}
        onPlay={() => roomData?.owner === thisUserId && handleVideoControl('play')}
        onPause={() =>roomData?.owner === thisUserId &&  handleVideoControl('pause')}
        onEnd={() =>roomData?.owner === thisUserId && handleVideoControl('end')}
        opts={{
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel:0,
            disablekb:1,
            iv_load_policy:3
          },
        }}
        style={{
          pointerEvents: roomData?.owner === thisUserId ? 'auto' : 'none', 
        }}

      />
      </div>
      <div className={s.content3}>
        <span className={s.item1}><FaUser/> {roomData?.members?.length}/{roomData?.limit}</span>
        <span className={s.item2}>
        <span className={s.miniItem1}>{t("Owner")}</span>
        <span className={s.miniItem2} onClick={()=>{thisUserId === roomData?.owner ? setOpenUserModal(true) : setUserInfo(roomData?.owner)}}>
        <img src={roomData?.users?.find(user=> user?.userId === roomData?.owner)?.photo_url} alt="" />
        {roomData?.users?.find(user=> user?.userId === roomData?.owner)?.first_name}
        </span>
        </span>
        {roomData?.owner === thisUserId &&
        <span className={s.item3} onClick={()=>{openSettings ?  setOpenSettings(false)   : handleOpenSettings() }}>
        <IoSettingsOutline color={openSettings ? "greenyellow" : "whitesmoke"}/>
        </span>
         }
      </div>
      <AnimatePresence>
      {replyMsg !== null && !roomData?.chatRoom?.find(m => m.id === replyMsg)?.deleted && <motion.div className={s.rpylMsgContent} 
              key="exitReplyMsg" exit={{ opacity: 0,scale:0.5}}
              initial={{ opacity: 0 ,y: -50}}
              animate={{ opacity: 1 ,y: 0 }}
              transition={{ duration: 0.15 }}>
      <div className={s.replyItem1}>
      <span className={s.replyMiniItem1}>
        <span>{t("In reply")}</span>
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(chat => chat.id === replyMsg)?.userId)?.first_name}
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(chat => chat.id === replyMsg)?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      </span> 
      <span className={s.replyMiniItem2}>
        {roomData?.chatRoom?.find(chat => chat.id === replyMsg)?.text?.length >= 40 
        ? <>{roomData?.chatRoom?.find(chat => chat.id === replyMsg)?.text.slice(0,40)}...</>
        : roomData?.chatRoom?.find(chat => chat.id === replyMsg)?.text
        }
      </span>
      </div>
      <button className={s.replyItem2} onClick={()=>{setReplyMsg(null)}}>
        <IoCloseCircle/>
      </button>
      </motion.div>}
      </AnimatePresence>
      <div className={textActive ? `${s.content5} ${s.textActive}` : s.content5} >
      <img src={thisUser?.photo_url} alt="" onClick={()=>{setOpenUserModal(true)}}/>
      <textarea 
      ref={textAreaRef}
      placeholder={`${t("Your message")}...`} 
      maxLength={300}
      onFocus={(e)=>{
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }} 
      onBlur={()=>{
        setTextActive(false)
        window.scrollTo(0, 0);
      }}  
  onChange={(e) => {
    const value = e.target.value;
  

    clearTimeout(typingTimeout); 
    typingTimeout = setTimeout(() => {
      setMessage(value);
      setTextActive(value.length >= 80); 
    }, 50);
  }}
      autoCorrect="off"  
      spellCheck="false" 
      autoComplete="off"
      name="" 
      id="">
        
      </textarea>
      <span><button onClick={handleSendMessage} disabled={!message && true}><FaCircleArrowUp/></button></span>
      </div>
      <AnimatePresence>
      {openSettings && roomData?.owner === thisUserId && <motion.div className={s.settingsContent} key="box" exit={{ opacity: 0,y: -250 }}
              initial={{ opacity: 0 ,y: -250}}
              animate={{ opacity: 1 ,y: 0 }}
              transition={{ duration: 0.4 }}>
        <div className={s.block1}>
          <span className={s.miniItem1}>{t("Room Settings")}</span>
          <span className={s.miniItem2}>
            <button className={s.searchBtn} onClick={()=>{setOpenSearchModal(true)}}><FaSearch />{t("Search on YouTube")}</button>
            <span className={s.item1}>
            {t("Link")}:
            <input placeholder={roomData?.videoLink} value={newVideoId} type="text"
            autoCorrect="off"  
            spellCheck="false" 
            autoComplete="off"
            onBlur={()=>{
            window.scrollTo(0, 0);
            }}  
             onChange={handleInputChange}/>
            <button disabled={(linkChanged || isDisabled) && true} onClick={handleVideoIdChange}>{linkChanged ? <FaCheck/> : t("Change")}</button></span>
            <span className={s.item1}>
            {t("Public Room")}:
          <label className={s.switch}>
              <input type="checkbox"       
              checked={roomData.is_public}
              onChange={(e) => {
        if (roomData?.owner === thisUserId) {
          handleToggleVisibility(e.target.checked);
        } 
      }}  />
             <span className={s.slider}></span>
          </label>  
            <button className={s.closeBtn} 
            onClick={()=>{setDeleteModal(true)}}
            >{t('Delete room')}<MdDelete/></button>
            </span>
          </span>
        </div>
        <div className={s.block2}>
          <span className={s.miniItem1}>{t("History joined users")}</span>
          <span className={s.miniItem2}>
            {JoinedUsers}
          </span>          
        </div>
        
      </motion.div>}
      </AnimatePresence>
      <div className={s.content4}  ref={chatContainerRef}
      onPointerMove={handleScrollChatStart}

      >
      <AnimatePresence>
      {lastGiftOpenModal &&
      <motion.div className={s.giftAnimContainer} key="giftContentModal" exit={{opacity:0}} onClick={()=>{setLastGiftOpenModal(false)}}>
        <motion.div className={lastGift?.giftImg !== "premium" ? s.giftAnimContent : `${s.giftAnimContent} ${s.giftPremiumContent}`}
              initial={{ opacity: 0  }}
              animate={{ opacity: 1  }}
              exit={{opacity:0 }}
              transition={{ duration: 0.3 }}>
          <motion.div 
          className={s.giftAnimItem1}
          key="giftItem1"
          initial={{ opacity: 0 , x:-50 }}
          animate={{ opacity: 1 , x:0 }}
          transition={{ duration: 1.5 }}>
          {lastGift?.text}{lastGift?.giftImg !== "premium" && <span>{lastGift?.giftPrice}<TiStarFullOutline/></span>}</motion.div>
          <motion.div 
          className={s.giftAnimItem2}
          key="giftItem2"
          initial={{ opacity: 0 ,scale:0.9}}
          animate={{ opacity: 1 , scale:1}}
          transition={{ duration: 2 }}
          >
           {lastGift?.giftImg !== "premium" ? <img src={lastGift?.giftImg} alt="" /> : <RiVipCrownFill/>}
          </motion.div>
          <motion.div 
          className={s.giftAnimItem3}
          key="giftItem3"
          initial={{ opacity: 0 , x:-50 }}
          animate={{ opacity: 1 , x:0 }}
          transition={{ duration: 2.5 }}>
            {lastGift?.nextText}
          </motion.div>
          <motion.div 
          className={s.giftAnimItem4}
          key="giftItem4"
          initial={{ opacity: 0 , y:100 }}
          animate={{ opacity: 1 , y: 0 }}
          transition={{ duration: 3 }}>
      {lastGift?.giftedTo && 
      <span className={roomData?.users?.find(user=> user?.userId === lastGift?.giftedTo)?.id === thisUser.id ? `${s.receiverYou} ${s.receiver}` : s.receiver} onClick={()=>{
        thisUserId === lastGift?.giftedTo 
        ? setOpenUserModal(true)
        : setUserInfo(lastGift?.giftedTo)
      }}>
      <img  src={roomData?.users?.find(user=> user?.userId === lastGift?.giftedTo)?.photo_url} alt=""/>
      {roomData?.users?.find(user=> user?.userId === lastGift?.giftedTo)?.id !== thisUser.id 
      ? roomData?.users?.find(user=> user?.userId === lastGift?.giftedTo)?.first_name
      : "You"}
      </span>}            
          </motion.div>
        </motion.div>
      </motion.div>}
      </AnimatePresence>
      {longPressTriggered !== null && 
      <div className={s.blurContent} onClick={()=>{setLongPressTriggered(null)}}></div>}
      {roomData && roomData?.chatRoom?.map((chat,index) => (
  <motion.div 
      initial={{ opacity: 0 ,y: -100}}
      animate={{ opacity: 1 ,y: 0 }}
      transition={{ duration: 0.5 }} 
      className={s.chatContent} 
      key={chat?.id}
      id={`msg${chat?.id}`}>
    {chat.userId === 'admin' 
      ? <span className={s.adminMsg}>
      <div className={s.admMiniContent} onClick={()=>{
        (thisUserId !== chat?.joinedId && 
        thisUserId !== chat?.leftId && 
        thisUserId !== chat?.blockedId && 
        thisUserId !== chat?.unblockedId && 
        thisUserId !== chat?.assignedOwnerId && 
        thisUserId !== chat?.senderId && 
        thisUserId !== chat?.giftSenderId) 
        ?
        setUserInfo(chat?.joinedId || chat?.leftId || chat?.blockedId || chat?.unblockedId || chat?.assignedOwnerId || chat?.senderId || chat?.giftSenderId)
        : setOpenUserModal(true)
      }}>
      {calculateLevel(roomData?.users?.find(user => user?.userId === ( chat?.giftSenderId || chat?.senderId ))?.exp) > 0 
      && <span className={getStyleLevel(calculateLevel(roomData?.users?.find(user => user?.userId === ( chat?.giftSenderId || chat?.senderId ))?.exp),s)}>
      <span>
      {calculateLevelChat(roomData?.users?.find(user => user?.userId === ( chat?.giftSenderId || chat?.senderId ))?.exp)} LvL
      </span>
      </span>}
      {(chat?.giftSenderId || chat?.senderId) && <span className={s.admMsgItem1}><img src={roomData?.users?.find(user => user?.userId === ( chat?.giftSenderId || chat?.senderId ))?.photo_url} alt="" /></span>}
      <span className={s.admMsgItem2}>
      {roomData?.users?.find(user => user?.userId === (chat?.joinedId || chat?.leftId || chat?.blockedId || chat?.unblockedId || chat?.assignedOwnerId || chat?.senderId || chat?.giftSenderId ))?.first_name}
      {roomData?.users?.find(user => user?.userId === (chat?.joinedId || chat?.leftId || chat?.blockedId || chat?.unblockedId || chat?.assignedOwnerId || chat?.senderId || chat?.giftSenderId))?.is_premium === 1 && <RiVipCrownFill/>}
        </span>
      </div>
      <span className={getMessageStyle(chat,s)}>
      {<span className={s.textChat}>{chat.text}{chat.giftPrice && <span>{chat.giftPrice} <TiStarFullOutline/></span>}</span>}
      {chat.giftImg !== "premium" ? <img className={s.giftImg} src={chat.giftImg} alt=""/> : <RiVipCrownFill/>}
      {chat.nextText && chat.nextText}
      {chat?.giftedTo && 
      <span className={s.receiver} onClick={()=>{
        thisUserId === chat?.giftedTo 
        ? setOpenUserModal(true)
        : setUserInfo(chat?.giftedTo)
      }}>
      <img  src={roomData?.users?.find(user=> user?.userId === chat?.giftedTo)?.photo_url} alt=""/>
      {roomData?.users?.find(user=> user?.userId === chat?.giftedTo)?.id !== thisUser.id 
      ? roomData?.users?.find(user=> user?.userId === chat?.giftedTo)?.first_name
      : "You"}
      </span>}
      </span>
      </span>  
      : 
      chat.userId === thisUserId
      ? 
      <AnimatePresence>
      {longPressTriggered !== chat.id 
      ?
      !chat?.deleted &&
        <motion.span className={s.yourMsgContainer}       
      key="keyyourmsg1" 
      initial={{ scale: 0.95 }}
      animate={{ scale:1 }}
      exit={{ opacity:0,scale:0.7 }}
      transition={{ duration: 0.4 }}>
      {/* <span className={s.msgContent1}><img src="" alt=""/></span> */}
      <span className={s.msgContent2}
      style={{
      background:(thisUser?.is_premium === 1 && thisUser?.custom_settings?.bgColorMsg) || "#444"
      }}>
      <span className={s.msgItem1}>You{thisUser?.is_premium === 1 && <RiVipCrownFill/>}</span> 
      <span className={s.msgItem2}
      onPointerDown={()=>{handlePressStart(chat.id)}} 
      onPointerUp={handlePressEnd}        
      onPointerCancel={handlePressEnd}>
      {chat.reply !== null && !roomData?.chatRoom?.find(m => m.id === chat.reply)?.deleted && <span className={s.replyContent} 
      onClick={() => {
    const element = document.getElementById(`msg${chat.reply}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      if (element.classList.contains(s.highlight)) {
        element.classList.remove(s.highlight);
      }
      element.classList.add(s.highlight);

      setTimeout(() => {
        element.classList.remove(s.highlight);
      }, 1500);
    }
  }}>
       <span className={s.replyMiniItem1}>
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.first_name}
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      </span> 
      <span className={s.replyMiniItem2}>
      {roomData?.chatRoom?.find(m => m.id === chat.reply)?.text}
      </span>       
      </span>}
      {chat.text}
      </span>
      </span>
      </motion.span>
      :         
      <motion.span className={s.selectedYourMsgContainer}       
      key="keyyourmsg2" 
      initial={{ scale: 0.7 }}
      animate={{ scale:1 }}
      exit={{ opacity:0 }}
      transition={{ duration: 0.15 }}>
      <span className={s.msgContent2}
      style={{
      background:(thisUser?.is_premium === 1 && thisUser?.custom_settings?.bgColorMsg) || "#444"
      }}>
      <span className={s.msgItem1}>You{thisUser?.is_premium === 1 && <RiVipCrownFill/>}</span> 
      <span className={s.msgItem2}>
      {chat.reply !== null && !roomData?.chatRoom?.find(m => m.id === chat.reply)?.deleted && <span className={s.replyContent}>
       <span className={s.replyMiniItem1}>
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.first_name}
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      </span> 
      <span className={s.replyMiniItem2}>
      {roomData?.chatRoom?.find(m => m.id === chat.reply)?.text}
      </span>       
      </span>}
      {chat.text}
      </span>
      </span>
      {longPressTriggered === chat.id && <motion.div className={s.msgContent3}
       initial={{ opacity: 0 ,y: 50}}
      animate={{ opacity: 1 ,y: 0 }}
      transition={{ duration: 0.2 }}>
        <button className={s.rplyBtn} onClick={()=>{
          setReplyMsg(chat.id)
          textAreaRef.current.focus()
          setLongPressTriggered(null)
        }}>{t("Reply")}<FaReply/></button>
        <button className={s.copyBtn} onClick={()=>{
          navigator.clipboard.writeText(chat.text)
          setLongPressTriggered(null)
        }}>{t("Copy")}<FaCopy/></button>
        {thisUserId === chat?.userId  && 
        <button className={s.delBtn} 
        onClick={()=>{
          deleteMessage()
        }}>{t("Delete")}<MdDelete/></button>}
      </motion.div>}
      </motion.span>}
      </AnimatePresence>      
      :
      <AnimatePresence>
      {longPressTriggered !== chat.id 
      ?
      !chat?.deleted && <motion.div className={s.msgContainer}
      key="keymsg1" 
      initial={{ scale: 0.95 }}
      animate={{ scale:1 }}
      exit={{ opacity:0,scale:0.7 }}
      transition={{ duration: 0.4 }}>
      <span className={s.msgContent1}>
      <img src={roomData?.users?.find(user=> user?.userId === chat.userId)?.photo_url} alt=""       
      onClick={()=>{
        thisUserId === chat?.userId
        ? setOpenUserModal(true)
        : setUserInfo(chat?.userId)
      }}/></span>
      <span className={s.msgContent2} 
      style={{
      background:(roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 && roomData?.users?.find(user => user?.userId === chat?.userId)?.custom_settings?.bgColorMsg) || "#444"
      }}
      >
      <span className={s.msgItem1} 
      style={{color:(roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 && roomData?.users?.find(user => user?.userId === chat?.userId)?.custom_settings?.nameColor) || "#5F9EA0"}}
      >
      {roomData?.users?.find(user => user?.userId === chat?.userId)?.first_name}
      {roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      {calculateLevel(roomData?.users?.find(user => user?.userId === chat?.userId)?.exp) > 0 
      && <span className={getStyleLevel(calculateLevel(roomData?.users?.find(user => user?.userId === chat?.userId)?.exp),s)}>
      <span>
      {calculateLevelChat(roomData?.users?.find(user => user?.userId === chat?.userId)?.exp)} LvL
      </span>
      </span>}
      </span> 
      <span className={s.msgItem2}  
      onPointerDown={()=>{handlePressStart(chat.id)}} 
      onPointerUp={handlePressEnd}        
      onPointerCancel={handlePressEnd}     
      >
      {chat.reply !== null  &&  !roomData?.chatRoom?.find(m => m.id === chat.reply)?.deleted && <span 
      className={s.replyContent} 
      onClick={() => {
    const element = document.getElementById(`msg${chat.reply}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      if (element.classList.contains(s.highlight)) {
        element.classList.remove(s.highlight);
      }
      element.classList.add(s.highlight);
      setTimeout(() => {
        element.classList.remove(s.highlight);
      }, 1500);
     }
    }}>
       <span className={s.replyMiniItem1}>
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.first_name}
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      </span> 
      <span className={s.replyMiniItem2}>
      {roomData?.chatRoom?.find(m => m.id === chat.reply)?.text}
      </span>       
      </span>}      
      {chat.text}
      </span>
      {roomData?.users?.find(user => user?.userId === chat?.userId)?.custom_settings?.chatSparkle 
        && roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 
       && <Sparkle 
        color={'#999'}
        fadeOutSpeed={ 5 }
        flicker={false}
        count={10}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'slow'}
        /> 
       }
      </span>
      </motion.div>
      
      :
    
      <motion.div className={s.selected}
      key="keymsg2" 
      initial={{ scale: 0.7 }}
      animate={{ scale:1 }}
      exit={{ opacity:0 }}
      transition={{ duration: 0.2 }}>
      <span className={s.msgContent1}>
      <img src={roomData?.users?.find(user=> user?.userId === chat.userId)?.photo_url} alt=""       
      onClick={()=>{
        thisUserId === chat?.userId
        ? setOpenUserModal(true)
        : setUserInfo(chat?.userId)
      }}/></span>
      <span className={s.msgContent2} 
      style={{
      background:(roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 && roomData?.users?.find(user => user?.userId === chat?.userId)?.custom_settings?.bgColorMsg ) || "#444"
      }}
      >
      <span className={s.msgItem1} 
      style={{color:(roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 && roomData?.users?.find(user => user?.userId === chat?.userId)?.custom_settings?.nameColor ) || "#5F9EA0"}}
      >
      {roomData?.users?.find(user => user?.userId === chat?.userId)?.first_name}
      {roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      {calculateLevel(roomData?.users?.find(user => user?.userId === chat?.userId)?.exp) > 0 
      && <span className={getStyleLevel(calculateLevel(roomData?.users?.find(user => user?.userId === chat?.userId)?.exp),s)}>
      <span>
      {calculateLevelChat(roomData?.users?.find(user => user?.userId === chat?.userId)?.exp)} LvL
      </span>
      </span>}
      </span> 
      <span className={s.msgItem2}>
      {chat.reply !== null && !roomData?.chatRoom?.find(m => m.id === chat.reply)?.deleted && <span className={s.replyContent}>
       <span className={s.replyMiniItem1}>
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.first_name}
        {roomData?.users?.find(user => user?.userId === roomData?.chatRoom?.find(m => m.id === chat.reply)?.userId)?.is_premium === 1 && <RiVipCrownFill/> }
      </span> 
      <span className={s.replyMiniItem2}>
      {roomData?.chatRoom?.find(m => m.id === chat.reply)?.text}
      </span>       
      </span>}      
      {chat.text}
      </span>
      {roomData?.users?.find(user => user?.userId === chat?.userId)?.custom_settings?.chatSparkle 
        && roomData?.users?.find(user => user?.userId === chat?.userId)?.is_premium === 1 
       && <Sparkle 
        color={'#999'}
        fadeOutSpeed={ 5 }
        flicker={false}
        count={10}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'slow'}
        />       }
      </span>
      {longPressTriggered === chat.id && <motion.div className={s.msgContent3}
      style={{bottom:thisUserId === roomData?.owner ? "-108px" : "-82px"}}
       initial={{ opacity: 0 ,y: 50}}
      animate={{ opacity: 1 ,y: 0 }}
      transition={{ duration: 0.2 }}>
        <button className={s.rplyBtn} onClick={()=>{
          setReplyMsg(chat.id)
          textAreaRef.current.focus();
          setLongPressTriggered(null)
        }}>{t("Reply")}<FaReply/></button>
        <button className={s.copyBtn} onClick={()=>{
          navigator.clipboard.writeText(chat.text)
          setLongPressTriggered(null)
        }}>{t("Copy")}<FaCopy/></button>
        <button className={s.giftBtn} onClick={()=>{
          setLongPressTriggered(null)
          setUserInfo(chat.userId)
          setOpenGiftModal(true)
        }}>{t("Send gift")}<FiGift/></button>
        {thisUserId === roomData?.owner && 
        <button className={s.delBtn} 
        onClick={()=>{
          deleteMessage()
        }}>{t("Delete")}<MdDelete/></button>}
      </motion.div>}
      </motion.div>}
      </AnimatePresence>
    }
  </motion.div>
)).slice(roomData?.chatRoom?.length - 100,roomData?.chatRoom?.length)}
      </div>
     <ExitModal exitModal={exitModal} setExitModal={setExitModal} t={t}/>
     <UserInfo userInfo={userInfo} setUserInfo={setUserInfo} roomData={roomData} setPremiumModal={setPremiumModal} infoState={infoState} setInfoState={setInfoState} setOpenGiftModal={setOpenGiftModal} setOpenGift={setOpenGift} thisUser={thisUser} t={t}/>
     <PremiumModal premiumModal={premiumModal} setPremiumModal={setPremiumModal} userInfo={userInfo} loading={loading} roomData={roomData} openInvoice={openInvoice} t={t} />
     <GiftModal openGiftModal={openGiftModal} setOpenGiftModal={setOpenGiftModal} userPhoto={roomData?.users?.find(user=> user.userId === userInfo)?.photo_url} name={roomData?.users?.find(user=> user.userId === userInfo)?.first_name} userId={roomData?.users?.find(user=> user.userId === userInfo)?.userId} socket={socket} toast={toast} roomId={roomId} setScroll={setScroll} />
     <GiftSettings openGift={openGift} setOpenGift={setOpenGift} />
     <UserModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal}/>
     <UserLevelInfo />
     <DeleteModal deleteModal={deleteModal} setDeleteModal={setDeleteModal} roomId={roomId} userId={thisUserId}/>
     <YouTubeSearch openSearchModal={openSearchModal} setOpenSearchModal={setOpenSearchModal} isRoom={true} handleVideoIdChange={handleVideoIdChange} newVideoId={newVideoId} setNewVideoId={setNewVideoId}/>
<ToastContainer
className={s.notificContainer}
position={openUserModal ? "top-center" : "bottom-center"}
autoClose={3000}
limit={2}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={true}
rtl={false}
pauseOnFocusLoss={false}
draggable
pauseOnHover={false}
theme="dark"
transition={Flip}
/>
    </div>
  );
};

export default Room