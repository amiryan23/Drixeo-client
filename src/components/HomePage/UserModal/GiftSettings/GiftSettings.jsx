import s from './GeiftSettings.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import { LiaWindowCloseSolid } from "react-icons/lia";
import { TiStarFullOutline } from "react-icons/ti";
import {useState,useContext,useEffect} from 'react'
import axios from 'axios'
import { MyContext } from './../../../../context/Context'
import { toast  } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { IoMdEyeOff } from "react-icons/io";
import {encryptData} from './../../../../helpers/decryptData'

const GiftSettings = ({openGift,setOpenGift}) => {

  const [isHidden, setIsHidden] = useState(null);
   const [senderDetails, setSenderDetails] = useState({ senderName: "", senderPhoto: "" });
   const [isCooldown, setIsCooldown] = useState(false);

  const {  thisUser,setThisUser } = useContext(MyContext);

  const { t } = useTranslation();

  const token = sessionStorage.getItem('__authToken');

  const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

  useEffect(()=>{
  	setIsHidden(openGift?.hidden)

    if (openGift?.senderId) {
      fetchSenderDetails(openGift.senderId);
    }

  },[openGift])


  const toggleHidden = async (hidden) => {
    toast.clearWaitingQueue()
  if (isCooldown) {
    toast.warn(t('Too often, please wait a few seconds'));
    window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    return;
  }
    try {
      setIsCooldown(true)
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/update-gift-hidden`, {
        giftId: openGift?.id,
        hidden: !isHidden, 
        userId:thisUserId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setIsHidden(!isHidden); 
        toast.info(`${isHidden ? t('Now the gift is visible to others') : t('Now the gift is visible only to you') }`,{
          icon:<IoMdEyeOff size="25"/>
        })
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
      const updatedUser = { 
        ...thisUser, 
        gifts: thisUser.gifts.map(gift => 
          gift.id === openGift?.id ? { ...gift, hidden: !isHidden } : gift
        )
      };

      setThisUser(updatedUser);
      }
    } catch (error) {
      console.error('Ошибка при обновлении hidden:', error);
    } finally {
    setTimeout(() => {
      setIsCooldown(false);
    }, 5000);
  }
  };

  const fetchSenderDetails = async (senderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/get-sender-details`, {
        encryptSenderId:encryptData(senderId,process.env.REACT_APP_SECRET_KEY_CODE),
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setSenderDetails({
          senderName: response.data.senderName,
          senderPhoto: response.data.senderPhoto,
        });
      }
    } catch (error) {
      console.error("Ошибка при получении данных отправителя:", error);
    }
  };
	return (
		<AnimatePresence>
		{openGift && <motion.div className={s.megaContainer} key="box" exit={{ opacity: 0 }}>
			<motion.div className={s.Container}
			initial={{ opacity: 0,y:50}}
      		animate={{ opacity: 1,y:0 }}
          exit={{ opacity: 0,y:50 }}
     	    transition={{ duration: 0.25 }}>
      				<div className={s.giftItem1}>
      				<span></span>
      				<span className={s.title}>{t("Gift")} {openGift?.name}</span>
      				<span onClick={()=>{
                setOpenGift(null)
                setSenderDetails(null)
              }}><LiaWindowCloseSolid/></span>
      				</div>
      				<img src={openGift?.imgUrl} alt="" className={s.giftItem2} />
      				<div className={s.giftItem3}>
					<label className={s.switch}>
  						<input type="checkbox" checked={isHidden} onClick={()=>{toggleHidden(openGift?.hidden)}} />
 						 <span className={s.slider}></span>
					</label>  
					{isHidden ? t("Hidden") : t("Hide")}    				
      				</div>
      				<div className={s.giftItem4}>{t("From")}: <img src={senderDetails?.senderPhoto} alt=""/> {senderDetails?.senderName}</div>
      				<div className={s.giftItem5}>{openGift?.price && Math.round(openGift.price * 0.8)}    
        <svg width="25" height="25" viewBox="0 0 24 24">
          <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="20%" stopColor="rgba(137,115,237,1)" />
          <stop offset="75%" stopColor="rgba(36,101,213,1)" />
        </linearGradient>
        <mask id="mask1">
          <TiStarFullOutline size={20} style={{ fill: "white" }} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" mask="url(#mask1)" />
    </svg> 
              <button disabled={true}>Soon</button>
              </div>
			</motion.div>
		</motion.div> }
		</AnimatePresence>
		)
}

export default GiftSettings