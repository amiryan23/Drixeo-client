import s from './UserInfo.module.scss'
import {calculateLevel,calculateLevelChat} from './../../../helpers/calculateLevel'
import {getStyleLevel} from './../../../helpers/getMessageStyle'
import { RiVipCrownFill } from "react-icons/ri";
import { LiaWindowCloseSolid } from "react-icons/lia";
import { motion,AnimatePresence} from 'framer-motion';
import Sparkle from 'react-sparkle'
import { FiGift } from "react-icons/fi";
import { IoMdEyeOff } from "react-icons/io";
import giftIcon from './../../../assets/giftIcon.json'
import {useEffect,useRef} from 'react'

import Lottie from 'lottie-react';

const UserInfo = ({userInfo,setUserInfo,roomData,setPremiumModal,infoState,setInfoState,setOpenGiftModal,setOpenGift,thisUser,t}) => {

const playerRef = useRef(null);

useEffect(()=>{
  playerRef.current?.play();
},[userInfo])

const currentLevel = calculateLevel(roomData?.users?.find(user => user?.userId === userInfo)?.exp)

const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

	return (
      <AnimatePresence>
      {userInfo && <motion.div className={s.userModalContainer} key="box" exit={{ opacity: 0 }}>
        <motion.div className={s.userModalContent} 
        initial={{ opacity: 0 , y:50}}
      animate={{ opacity: 1 , y:0}}
      exit={{ opacity: 0 , y:50 }}
      transition={{ duration: 0.3 }}
      > 
          <div className={s.userInfoContent1} 
          style={{background:(roomData?.users?.find(user => user?.userId === userInfo)?.is_premium === 1 && roomData?.users?.find(user => user?.userId === userInfo)?.custom_settings?.profileBg) || "transparent"}}>
          <div className={s.exitBtn}>
          {roomData?.users?.find(user=> user.userId === userInfo)?.is_premium !== 1 && thisUserId !== userInfo
          ? <span className={s.giftPremium} onClick={()=>{setPremiumModal(true)}}><RiVipCrownFill/>{t("Gift a premium subscription")}</span>
          : <span></span>}
          <span onClick={()=>setUserInfo(null)}><LiaWindowCloseSolid/></span>
          </div>
          <img src={roomData?.users?.find(user=> user.userId === userInfo)?.photo_url} alt=""/>
          <span className={s.userName}>
          {roomData?.users?.find(user=> user.userId === userInfo)?.first_name}
          {roomData?.users?.find(user=> user.userId === userInfo)?.is_premium === 1 && <RiVipCrownFill/>}
          {currentLevel > 0 
          && <span className={getStyleLevel(currentLevel,s)}>
          <span>
          {calculateLevelChat(roomData?.users?.find(user => user?.userId === userInfo)?.exp)} LvL
          </span>
          </span>}
          </span>
       {roomData?.users?.find(user => user?.userId === userInfo)?.custom_settings?.profileSparkle
        && roomData?.users?.find(user => user?.userId === userInfo)?.is_premium === 1 
          && <Sparkle 
        color={'#999'}
        fadeOutSpeed={ 7 }
        flicker={true}
        count={200}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'normal'}
          /> 
         }
          {roomData?.users?.find(user=> user?.userId === userInfo)?.id !== thisUser.id && <div className={s.item1} onClick={()=>{setOpenGiftModal(true)}}>
           <Lottie ref={playerRef} animationData={giftIcon} loop={0} style={{ width: '30px', height: '30px' }} />
              </div>}
          </div>
          <div className={s.userInfoContent2}>
            <div className={s.userInfoItem1}>
              <button className={infoState === "gifts" ? `${s.activeBtn} ${s.giftBtn}` : s.giftBtn} onClick={()=>{setInfoState("gifts")}}>{t("Gifts")}</button>
              <button className={infoState === "stats" ? `${s.activeBtn} ${s.statsBtn}` : s.statsBtn} onClick={()=>{setInfoState("stats")}}>{t("Stats")}</button>
            </div>
            <div className={s.userInfoItem2}>
           
              {infoState === "gifts" 
              ? <motion.div key="gifts" 
                className={s.userGiftContent}
                initial={{ opacity: 0,x:50}}
               animate={{ opacity: 1,x:0 }}
              transition={{ duration: 0.2 }}>
              <div className={s.userGiftMiniContent}>
              {roomData?.users?.find(user => user?.userId === userInfo)?.gifts.filter(gift=> thisUserId !== userInfo ? gift.hidden !== true : gift).filter(gift => gift.is_selled !== true).length !== 0
               ? roomData?.users?.find(user => user?.userId === userInfo)?.gifts
               .filter(gift=> thisUserId !== userInfo ? gift.hidden !== true : gift).filter(gift => gift.is_selled !== true)
               .map(gift => <motion.div 
                className={gift.hidden ? `${s.hiddenGift} ${s.item2}` : s.item2} 
                key={gift.id}
                initial={{ opacity: 0}}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                onClick={()=>{thisUserId=== userInfo && setOpenGift(gift)}}>
                 {gift.hidden && <span className={s.miniItem1}><IoMdEyeOff/></span>}
                 <img src={gift.imgUrl} alt="" className={s.miniItem2} />
                 <span className={s.miniItem3}>
                 <img src={gift.senderPhoto} alt="" />
                 {gift.senderName.length > 7 ? <span>{gift.senderName.slice(0,7)}...</span> : gift.senderName}</span>
               </motion.div>)?.reverse()

               : <span className={s.noGifts}>{t("Gifts are unavailable")}</span> }
               </div>
              </motion.div>
              : <motion.div key="stats" 
              
                initial={{ opacity: 0,x:-50}}
               animate={{ opacity: 1,x:0 }}
              transition={{ duration: 0.2 }}>
              Soon</motion.div>
              }
            
            </div>
          </div>

        </motion.div>
      </motion.div>}
      </AnimatePresence>
		)
}


export default UserInfo