import s from './HomePage.module.scss'
import React,{useState,useContext,useEffect,useRef} from 'react'
import { MyContext } from './../../context/Context'
import { motion,AnimatePresence} from 'framer-motion';
import { HiUsers } from "react-icons/hi2";
import axios from 'axios';
import { ToastContainer, toast ,Flip } from 'react-toastify';
import { RiVipCrownFill } from "react-icons/ri";
import Sparkle from 'react-sparkle'
import { TiStarFullOutline } from "react-icons/ti";
import { LuSettings } from "react-icons/lu";
import { BsInfoCircle } from "react-icons/bs";
import SettingsModal from './SettingsModal/SettingsModal'
import Menu from './Menu/Menu'
import UserModal from './UserModal/UserModal'
import Loader from './../Loader/Loader'
import ProjectInfo from './ProjectInfo/ProjectInfo'
import { Oval } from 'react-loader-spinner'
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { IoLockClosed } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import YouTubeSearch from './YouTubeSearch/YouTubeSearch'
import { FaCheck } from "react-icons/fa6";

const HomePage = () => {
	const {  thisUser,setThisUser,loader } = useContext(MyContext);

	const [joinOpenModal,setJoinOpenModal] = useState(false)
	const [createOpenModal,setCreateOpenModal] = useState(false)
	const [roomId, setRoomId] = useState(null);
	const [loading,setLoading] = useState(false)
	const [description,setDescription] = useState(null)
	const [limite,setLimite] = useState(2)
	const [videoLink,setVideoLink] = useState(null)
	const [isPublic,setIsPublic] = useState(false)
	const [premiumModal,setPremiumModal] = useState(false)
	const [openUserSettings,setOpenUserSettings] = useState(false)
	const [openSettingsModal,setOpenSettingsModal] = useState(false)
	const [openUserModal,setOpenUserModal] = useState(false)
	const [isDisabled, setIsDisabled] = useState(true);
	const [videoUrl, setVideoUrl] = useState("");
	const [loadingVideo,setLoadingVideo] = useState(false)
	const [openSearchModal,setOpenSearchModal] = useState(false)

	const token = sessionStorage.getItem('__authToken');

	const savedLink = sessionStorage.getItem('__YoutubeLinkVideo')

	const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

	const premium1 = 350
	const premium2 = 1000

	const timerRef = useRef()

const { t } = useTranslation();

const start_param = new URLSearchParams(window.Telegram.WebApp?.initData).get('room') || null;

useEffect(() => {
    const isRedirected = sessionStorage.getItem('redirected');

    if (start_param !== null && !isRedirected) {
        sessionStorage.setItem('redirected', 'true');
        window.location.href = `/room/${start_param}`;
    }
}, []);


	 const handleCreateRoom = async () => {
	 	setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/rooms/create-room`, {
        limit: limite,
        videoLink: videoLink || savedLink,
        is_public:isPublic,
        description:description,
        userId: thisUserId,
      },
      { headers: {
    			'Authorization': `Bearer ${token}`
  			}
  		}
  			);

      setCreateOpenModal(false)

      if (response.status === 201) {
        setLoading(false)
        setLimite(2)
        setVideoLink(null)
        setIsPublic(false)
        toast.success(t('Room successfully created'))
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
        setTimeout(()=>{window.location.href = `/room/${response?.data?.yourRoomId}`},3000)
      }
    } catch (error) {
    	clearTimeout(timerRef.current)
    	timerRef.current = setTimeout(()=>{setLoading(false)},5000)
    	window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    	  if (error.response && error.response.data && error.response.data.remainingMinutes) {
    const minutes = error.response.data.remainingMinutes;
    toast.error(t(`You can create a new room in`) + " " + minutes + " " + t('minutes'))
  } else {
      toast.error(t('Failed to create room'));
      
    }
    }
  };

    const handleJoinRoom = async () => {
    	setLoading(true)
    	window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
    try {
const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms/join/${roomId}`,{
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: {
      userId: thisUserId
    }
  });
      if (response.data) {
      	const totalMembers = JSON.parse(response.data.members)
      	const blockedUsers = JSON.parse(response.data.blocked)
      	

      	if(!blockedUsers.includes(thisUserId)){
      	if(response.data.limit > totalMembers.length){
      		setLoading(false)
      		setRoomId(null)
      		setJoinOpenModal(false)
      		window.location.href = `/room/${roomId}`
      	} else if(response.data.limit <= totalMembers.length) {
        setLoading(false)
        setRoomId(null)
		toast.info(t('The room is full!'));
		window.Telegram.WebApp.HapticFeedback.notificationOccurred("warning");
   		 } 

   		} else{
   			setLoading(false)
   			setRoomId(null)
   			toast.error(t('You have been blocked in this room!'))
   			window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
   		}
        
      } 
    } catch (error) {
      setLoading(false)
      setRoomId(null)
      toast.error(t('The room does not exist!'))
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    }
  };



 async function openInvoice(months, price) {
 	setLoading(true)
	window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
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
          
          await axios.post(`${process.env.REACT_APP_API_URL}/api/update-premium`, {
            userId: thisUserId,  
            isPremium: 1,
            months: months, 
            price:price
          },
           { headers: {
     					 'Authorization': `Bearer ${token}`
  				}
  		});

          setLoading(false)
          const currentDate = new Date();
    	  const expirationDate = new Date(currentDate.setMonth(currentDate.getMonth() + months));
          setThisUser({...thisUser,is_premium:1,premium_expires_at:expirationDate.toISOString()})
          setPremiumModal(false)
		  toast.success(t("Premium successfully purchased"),{
		  	icon:<RiVipCrownFill size="25" color="#0088cc" />
		  });
		  window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");         
        } catch (error) {
          console.error("Ошибка при обновлении данных пользователя:", error);
          alert("Не удалось обновить премиум-подписку.");
        }
      
      } else if (status === "cancelled") {
      	setLoading(false)
      	console.log("cancelled")
        
      } else if (status === "pending") {
      	
        console.log("wait")
      } else if (status === "failed"){
      	setLoading(false)
        console.log("failed")
      }
    });
  } catch (error) {
  	setLoading(false)
    console.error("Ошибка при открытии счет-фактуры:", error);
    alert(error)
  }
}

const premiumExpiresAt = thisUser?.premium_expires_at;

const date = new Date(premiumExpiresAt);

const day = String(date.getDate()).padStart(2, '0'); 
const month = String(date.getMonth() + 1).padStart(2, '0'); 
const year = date.getFullYear();

const formattedDate = `${day}.${month}.${year}`;


  const handleInputChange = (e) => {

  	if(savedLink){
  		sessionStorage.removeItem('__YoutubeLinkVideo')
  	}


    const link = e.target.value;
    setVideoLink(link);

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (youtubeRegex.test(link) ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true); 
    }
  };




	return ( 
		!loader ?
		<div className={s.megaContainer}>
		<motion.div className={s.header} 
					initial={{ opacity: 0 ,y: -50}}
        			animate={{ opacity: 1 ,y: 0 }} 
					transition={{ duration: 0.5 }}>
					<div className={s.headerContent1}>
					Soon
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
					</div>
					<div className={s.headerContent2}>
		<AnimatePresence>
		{openUserSettings && <motion.div key="settings" exit={{ opacity: 0,x:100,scale: 1,rotateZ: 0 }}
					// onClick={()=>{setOpenUserSettings(false)}}			       
				    initial={{ opacity: 0 ,x: 100,scale: 1,rotateZ: 0}}
        			animate={{ opacity: 1 ,x: 0,scale: 1.5,rotateZ: 360 }} 
					transition={{ duration: 0.5 }}
        			className={s.infoPremium}
        			onClick={()=>{					
        			setPremiumModal(true)
        			setOpenUserSettings(false)
					window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
				}}><BsInfoCircle/></motion.div>}
        </AnimatePresence>
		<AnimatePresence>
		{openUserSettings && <motion.div key="settings" exit={{ opacity: 0,x:50,scale: 1,rotateZ: 0 }}
					// onClick={()=>{setOpenUserSettings(false)}}			       
				    initial={{ opacity: 0 ,x: 50,scale: 1,rotateZ: 0}}
        			animate={{ opacity: 1 ,x: 0,scale: 1.5,rotateZ: 360 }} 
					transition={{ duration: 0.5 }}
        			className={s.userSettings}
        			onClick={()=>{
        				setOpenSettingsModal(true)
        				setOpenUserSettings(false)
						window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
        			}}><LuSettings/></motion.div>}
        </AnimatePresence>
        {thisUser?.is_premium !== 1
        ? <div className={`${s.premiumIcon} ${s.disabled}`} 
        onClick={()=>{
        	toast.info(t('You are not a premium user'),{
        		icon:<RiVipCrownFill size="25" color="#999"/>
        	})
        	window.Telegram.WebApp.HapticFeedback.notificationOccurred("warning");
        }}><RiVipCrownFill/><span>{t("Premium")}</span></div>
        : <div className={s.premiumIcon}
         onClick={()=>{openUserSettings ? setOpenUserSettings(false) : setOpenUserSettings(true)}}><RiVipCrownFill/><span>{t('Premium')}</span></div>
		}
		</div>
		</motion.div>
			<motion.div className={s.Container}
			        initial={{ opacity: 0 }}
        			animate={{ opacity: 1 }}
        			transition={{ duration: 0.5 }}>
        		<div className={s.content1} 
        		onClick={()=>{
        			window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        			setOpenUserModal(true)
        		}}>
        		<img src={thisUser?.photo_url} alt="" />
        		</div>
				<div className={s.content2}>{thisUser?.first_name}</div>
				<div className={s.content3}>
					<button className={s.btn1} onClick={()=>{setCreateOpenModal(true)}}>
					<Skeleton
          className={s.skeleton}
          baseColor="rgba(256,256,256,0)"
           highlightColor="rgba(78,141,246,0.4)"
           duration={5}/>
          {t('Create room')}</button>
					<button className={s.btn2} onClick={()=>{setJoinOpenModal(true)}}>
					<Skeleton
          className={s.skeleton}
          baseColor="rgba(256,256,256,0)"
           highlightColor="rgba(256,256,256,0.4)"
           duration={5}/>
           {t('Join the room')}</button>
				</div>
				<button className={s.content4} onClick={()=>{
					setPremiumModal(true)
					window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
				}}>
				<Skeleton
          className={s.skeleton}
          baseColor="rgba(256,256,256,0)"
          highlightColor="rgba(256,256,256,0.1)"
          duration={5}/>
				<RiVipCrownFill/>
				<Sparkle 
				color={'rgba(256,256,256,0.5)'}
				fadeOutSpeed={ 15 }
				flicker={true}
				count={50}
				minSize = { 5 } 
				maxSize = { 5 }
				overflowPx = { 0 } 
				flickerSpeed={'slow'}
				/>
				{thisUser?.is_premium === 1 ? t('You are a premium user') : t('Become a premium user')}</button>
			</motion.div>
			<Menu/>
			<ProjectInfo/>
			<AnimatePresence>
			{joinOpenModal 
			? <motion.div className={s.joinModale} key="box" exit={{ opacity: 0 }}>
				<motion.div className={s.modalContainer}
					initial={{ opacity: 0 ,scale:0.7}}
        			animate={{ opacity: 1 ,scale:1 }}
        			exit={{ opacity: 0 , scale:0.7 }}
        			transition={{ duration: 0.4 }}
        			>
					<div className={s.block1}>{t('Join the room')}</div>
					<div className={s.block2}>
					{t("Room")} №
					<input type="tel" value={roomId || ""} 
					placeholder={`${t("Room")} №`}
					onBlur={()=>{
   					window.scrollTo(0, 0);
    				  }}  	
					onChange={(e)=>{
						setRoomId(e.target.value)}}/></div>
					<div className={s.block3}>
					<button className={s.joinBtn} disabled={(loading || !roomId || roomId?.length < 6 )  && true} onClick={handleJoinRoom}>
					{loading ?       		
			<Oval
  			visible={true}
  			height="20"
  			width="20"
  			color="whitesmoke"
  			ariaLabel="oval-loading"
 			wrapperStyle={{}}
  			wrapperClass=""
 			 />  : t("Join")}</button>
					<button className={s.exitBtn} onClick={()=>{setJoinOpenModal(false)}}>{t('Exit')}</button>
					</div>

				</motion.div>
			</motion.div>

			: ""}
			</AnimatePresence>
			<AnimatePresence>
			{createOpenModal 
			? <motion.div className={s.createModale} key="box" exit={{ opacity: 0 }}>
				<motion.div className={s.modalContainer}
					initial={{ opacity: 0 ,scale:0.7}}
        			animate={{ opacity: 1 ,scale:1 }}
        			exit={{ opacity: 0 , scale:0.7 }}
        			transition={{ duration: 0.4 }}
        			>
					<div className={s.block1}>{t('Create room')}</div>
					<div className={s.block2}>
					{t("Room description")}
					<input 
					type="text" 
					placeholder={t("Room description")}
					value={description || null} 
					maxLength={21} 
					onBlur={()=>{
   					window.scrollTo(0, 0);
    				  }}  
					onChange={(e)=>{setDescription(e.target.value)}}/>
					</div>
					<div className={s.block2}>
					<span className={s.ytbSearch}>{t("Youtube video link")}<button onClick={()=>{setOpenSearchModal(true)}}><FaSearch />{t("Search")}</button></span>
					<input type="text"
					className={s.linkinput}
					placeholder={t("Youtube video link")}
					value={savedLink || videoLink || ""}
					disabled={(videoUrl || loadingVideo) && true}
					onBlur={()=>{
   					window.scrollTo(0, 0);
    				  }}  		
					onChange={handleInputChange}/>
					{!isDisabled && <motion.span 
					className={s.check}
					initial={{ opacity: 0 ,scale:0.7}}
        	animate={{ opacity: 1 ,scale:1 }}
        	exit={{ opacity: 0 , scale:0.7 }}
        	transition={{ duration: 0.4 }}
					><FaCheck/></motion.span>}
					</div>
					<div className={s.miniContent}>
					<div className={s.block2}>{t('Quantity')}
					<span className={s.maxMembers}> 
					<HiUsers/>
					<select name="members" type="select" 
					onChange={(e)=>{
						setLimite(e.target.value)
						window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
					}}>
					<option value="2">2</option>
					<option value="4">4</option>
					<option disabled={thisUser?.is_premium === 0 && true} value="8">8 {thisUser?.is_premium === 0 &&  "Premium"}</option>
					</select>
					</span></div>
					<div className={s.block2}>
						{t("Public")}
						<label className={s.switch}>
  						<input 
  						type="checkbox" 
  						checked={isPublic} 
  						onChange={(e)=>{
  							setIsPublic(e.target.checked)
  							window.Telegram.WebApp.HapticFeedback.notificationOccurred("success");
  						}}/>
 						 <span className={s.slider}></span>
						</label>
					</div>
					</div>
					<div className={s.rulesBlock}>
					{t("Before creating, please review the")}
					<span className={s.terms} onClick={()=>{
						window.Telegram.WebApp.openLink("https://telegra.ph/Terms-of-Use-for-Drixeo-02-18",{try_instant_view:true})
					}}>{t("terms of use")}</span></div>
					<div className={s.block3}>
					<button className={s.joinBtn} disabled={(loading || isDisabled) && true} onClick={handleCreateRoom}>
					{loading 
					? 
			<Oval
  			visible={true}
  			height="20"
  			width="20"
  			color="whitesmoke"
  			ariaLabel="oval-loading"
 			wrapperStyle={{}}
  			wrapperClass=""
 			 />  : t('Create')}
					</button>
					<button className={s.exitBtn} onClick={()=>{setCreateOpenModal(false)}}>{t("Exit")}</button>
					</div>

				</motion.div>
			</motion.div>

			: ""}
			</AnimatePresence>
	 <AnimatePresence>
      	{premiumModal && <motion.div className={s.premiumModalContainer} key="box" exit={{ opacity: 0 }}>
        <motion.div className={s.premiumModalContent} 
        initial={{ opacity: 0 , scale:0.7 }}
      animate={{ opacity: 1 , scale:1 }}
      exit={{ opacity: 0 , scale:0.7 }}
      transition={{ duration: 0.4 }}>
      	<span className={s.premiumContent1}>{t("Premium")} <RiVipCrownFill/></span>
      	{thisUser.is_premium !== 1 && <span className={s.premiumContent2}>{t("Buy premium and unlock new features")}</span>}
      	<span className={s.premiumContent3}>
      	{thisUser.is_premium !== 1
      	 ? <>	<button className={s.premiumItem1} disabled={loading && true} onClick={()=>{openInvoice(1,window.Telegram.WebApp?.initDataUnsafe?.user?.is_premium === true ? premium1/2 : premium1)}}>
      			{!loading ? 
      			<>
      			{window.Telegram.WebApp?.initDataUnsafe?.user?.is_premium === true && <span className={s.salePremium}>-50%</span>}
      			<span className={s.premiumMiniItem1}><RiVipCrownFill/>{t("Premium for 1 month")}</span>
      			<span className={s.premiumMiniItem2}>
      				{window.Telegram.WebApp?.initDataUnsafe?.user?.is_premium === true ? <><span className={s.discount}>{premium1}</span>{premium1/2}</> : premium1}
      				<TiStarFullOutline/>
      			</span>
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
      		<button className={s.premiumItem1} disabled={loading && true} onClick={()=>{openInvoice(3,window.Telegram.WebApp?.initDataUnsafe?.user?.is_premium === true ? premium2/2 : premium2)}}>
      			{!loading ?
      			 <>
      			 {window.Telegram.WebApp?.initDataUnsafe?.user?.is_premium === true && <span className={s.salePremium}>-50%</span>}
      			 <span className={s.premiumMiniItem1}><RiVipCrownFill/>{t("Premium for 3 months")}</span>
      			<span className={s.premiumMiniItem2}>
      			{window.Telegram.WebApp?.initDataUnsafe?.user?.is_premium === true ? <><span className={s.discount}>{premium2}</span>{premium2/2}</> : premium2}
      			<TiStarFullOutline/></span>
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
      		</>
      	: <span className={s.premiumActiveBlock}>
      		<span  className={s.item1}>{t("Premium is active until")}</span>
      		<span  className={s.item2}>{formattedDate}</span>
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
      	</span>}
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
     <SettingsModal openSettingsModal={openSettingsModal} setOpenSettingsModal={setOpenSettingsModal} toast={toast}/>
     <UserModal openUserModal={openUserModal} setOpenUserModal={setOpenUserModal} />
  	<YouTubeSearch openSearchModal={openSearchModal} setOpenSearchModal={setOpenSearchModal} setIsDisabled={setIsDisabled}/>   
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
		: <Loader />
		)
}

export default HomePage