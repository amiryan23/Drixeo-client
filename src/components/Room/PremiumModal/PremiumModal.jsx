import s from './PremiumModal.module.scss'
import { motion,AnimatePresence} from 'framer-motion';
import Sparkle from 'react-sparkle'
import { Oval } from 'react-loader-spinner'
import { RiVipCrownFill } from "react-icons/ri";
import { TiStarFullOutline } from "react-icons/ti";

const PremiumModal = ({premiumModal,setPremiumModal,userInfo,loading,roomData,openInvoice,t}) => {


  const premium1 = 350
  const premium2 = 1000


	return (
        <AnimatePresence>
        {premiumModal && <motion.div className={s.premiumModalContainer} key="box" exit={{ opacity: 0 }}>
        <motion.div className={s.premiumModalContent} 
        initial={{ opacity: 0}}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}>
        <span className={s.premiumContent1}>{t("Gift Premium")} <RiVipCrownFill/></span>
        <span className={s.premiumContent2}>
        {t("Premium for")}
        <img src={roomData?.users?.find(user=> user.userId === userInfo)?.photo_url} alt=""/>
        <span className={s.nameGift}>{roomData?.users?.find(user=> user.userId === userInfo)?.first_name}</span>
        </span>
        <span className={s.premiumContent3}>
            <button className={s.premiumItem1} disabled={loading && true} onClick={()=>{openInvoice(1,premium1)}}>
            {!loading ? 
            <>
            <span className={s.premiumMiniItem1}><RiVipCrownFill/>{t("Premium for 1 month")}</span>
            <span className={s.premiumMiniItem2}>350<TiStarFullOutline/></span>
            </>
            :           
        <Oval
        visible={true}
        height="20"
        width="20"
        color="whitesmoke"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
       /> }
        <Sparkle 
        color={'rgba(256,256,256,0.5)'}
        fadeOutSpeed={ 5 }
        flicker={true}
        count={50}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'slow'}
        />          
          </button>
          <button className={s.premiumItem1} disabled={loading && true} onClick={()=>{openInvoice(3,premium2)}}>
           {!loading ? 
           <> 
           <span className={s.premiumMiniItem1}><RiVipCrownFill/>{t("Premium for 3 months")}</span>
            <span className={s.premiumMiniItem2}>1000<TiStarFullOutline/></span>
          </>
          :           
        <Oval
        visible={true}
        height="20"
        width="20"
        color="whitesmoke"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
       /> }
        <Sparkle 
        color={'rgba(256,256,256,0.5)'}
        fadeOutSpeed={ 5 }
        flicker={true}
        count={50}
        minSize = { 5 } 
        maxSize = { 5 }
        overflowPx = { 0 } 
        flickerSpeed={'slow'}
        />            
          </button>
        </span>
        <span className={s.premiumContent4}>
          <span className={s.premiumInfoItem1}>{t("Possibilities")}</span>
          <span className={s.premiumInfoItem2}>&#9658; {t("The room can be created for larger audiences.")}</span>
          {/* <span className={s.premiumInfoItem2}>&#9658; You will gain the ability to use stickers in the chat.</span> */}
          <span className={s.premiumInfoItem2}>&#9658; {t("You will have the opportunity to send premium gifts.")}</span>
          <span className={s.premiumInfoItem2}>&#9658; {t("Premium emojis with your username.")}</span>
          <span className={s.premiumInfoItem2}>&#9658; {t("The ability to customize your profile design.")}</span>
        </span>
        <span className={s.premiumContent5}>
          <button onClick={()=>{setPremiumModal(false)}}>{t("Close")}</button>
        </span>
        </motion.div>
      </motion.div>}
     </AnimatePresence>
		)
}

export default PremiumModal