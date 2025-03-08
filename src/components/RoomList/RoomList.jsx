import s from './RoomList.module.scss'
import Menu from './../HomePage/Menu/Menu'
import { motion} from 'framer-motion';
import {useState,useEffect,useContext,useRef} from 'react'
import { ToastContainer, toast ,Flip } from 'react-toastify';
import axios from 'axios'
import { MyContext } from './../../context/Context'
import { Oval } from 'react-loader-spinner'
import { useTranslation } from 'react-i18next';
import ProjectInfo from './../HomePage/ProjectInfo/ProjectInfo'
import cinemaIcon from './../../assets/cinemaIcon.json'
import Lottie from 'lottie-react';


const RoomList = () => {

	const [rooms, setRooms] = useState([]);
	const [myRooms,setMyRooms] = useState([])
	const [searchRoom,setSearchRoom] = useState('')
	const { thisUser,setActiveLink } = useContext(MyContext);
	const [loading,setLoading] = useState(false)

	const { t } = useTranslation();

	const playerRef = useRef(null);

	const token = sessionStorage.getItem('__authToken');

	const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

	useEffect(() => {
    
    setActiveLink("roomlist")

    const fetchPublicRooms = async (userId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms/public-rooms?userId=${userId}`,{
         headers: {
    			'Authorization': `Bearer ${token}`
  			}
        });
        setRooms(response.data); 
      } catch (error) {
        console.error('Ошибка при загрузке публичных комнат:', error);
      }
    };

    const fetchMyRooms = async (userId) => {
  		try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/rooms/my-rooms?userId=${userId}`,{
        headers: {
    			'Authorization': `Bearer ${token}`
  			}	
    });
    setMyRooms(response.data); 
 		 } catch (error) {
    console.error('Ошибка при загрузке своих комнат:', error);
 		 }
		};

		playerRef.current?.playFromBeginning();

    fetchPublicRooms(thisUserId);
    fetchMyRooms(thisUserId)

  }, []);


    const handleJoinRoom = async (roomId) => {
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
      		// setRoomId(null)
      		// setJoinOpenModal(false)
      		window.location.href = `/room/${roomId}`
      	} else if(response.data.limit < totalMembers.length) {
        setTimeout(()=>{setLoading(false)},4000)
        // setRoomId(null)
		toast.info(t('The room is full!'));
		window.Telegram.WebApp.HapticFeedback.notificationOccurred("warning");
   		 } 

   		} else{
   			setTimeout(()=>{setLoading(false)},4000)
   			// setRoomId(null)
   			toast.error(t('You have been blocked in this room!'))
   			window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
   		}
        
      } 
    } catch (error) {
      setTimeout(()=>{setLoading(false)},4000)
      // setRoomId(null)
      toast.error(t('The room does not exist!'))
      window.Telegram.WebApp.HapticFeedback.notificationOccurred("error");
    }
  };


	const publicRooms = 
			rooms 
			? rooms.filter((room)=>room.owner !== thisUserId)
			.filter((room) =>room?.description?.toLowerCase().includes(searchRoom.toLowerCase()))
    		.map(room => <motion.div 
    			initial={{ opacity: 0 }}
        		animate={{ opacity: 1 }}
        		transition={{ duration: 0.3 }}
    			className={s.roomListContent} 
    			key={room.roomId}>
				<div className={s.item1}>{room.roomId}</div>
				<div className={s.item2}>{room.description}</div>
				<div className={s.item3}>{room.membersCount}/{room.limit}</div>
				<button className={s.item4} 
				disabled={(room.membersCount === room.limit || loading ) && true} 
				onClick={()=>{handleJoinRoom(room.roomId)}}>
				{loading 
				?       				
				<Oval
  			visible={true}
  			height="11"
  			width="11"
  			color="whitesmoke"
  			ariaLabel="oval-loading"
 			wrapperStyle={{}}
  			wrapperClass=""
 			 />
				: t("Join")}
				</button>
			</motion.div>).reverse()
			: false


			const arrayMyRooms = myRooms 
			? myRooms.map(room => <motion.div 
    			initial={{ opacity: 0 }}
        		animate={{ opacity: 1 }}
        		transition={{ duration: 0.3 }}
    			className={`${s.roomListContent} ${s.myRoomListContent}`} 
    			key={room.roomId}>
				<div className={s.item1}>{room.roomId}</div>
				<div className={s.item2}>{room.description}</div>
				<div className={s.item3}>{room.membersCount}/{room.limit}</div>
				<button className={s.item4} 
				disabled={(room.membersCount === room.limit || loading) && true} 
				onClick={()=>{handleJoinRoom(room.roomId)}}>
				{loading 
				?       				
				<Oval
  			visible={true}
  			height="11"
  			width="11"
  			color="whitesmoke"
  			ariaLabel="oval-loading"
 			wrapperStyle={{}}
  			wrapperClass=""
 			 />
				: t("Join")}
				</button>
			</motion.div>).reverse()
			: false

	return (
		<div className={s.megaContainer}>
		<div className={s.content1}>{t("Public Room List")}</div>
		<motion.div 
		initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
		className={s.content2}>
		<Lottie ref={playerRef} animationData={cinemaIcon} loop={0}  style={{ width: '190px', height: '190px' }} />
 			 <input 
 			 placeholder="Search Room..." 
 			 value={searchRoom || null} 
 			 onChange={(e)=>{setSearchRoom(e.target.value)}}
 			 onBlur={()=>{
   					window.scrollTo(0, 0);
    				  }}   
 			 type="text" />
			<div className={s.roomListContainer}>
			<div className={s.roomListDescription}>
				<div className={s.item1}>№</div>
				<div className={s.item2}>{t("Room description")}</div>
				<div className={s.item3}></div>
				<div className={s.item4}></div>
			</div>
			{arrayMyRooms}
			{publicRooms?.length > 0 ? publicRooms : <span className={s.notRooms}>{t("There are no public rooms at the moment")}</span>}
			</div>
		</motion.div>
			<Menu/>
			<ProjectInfo/>
<ToastContainer
position="bottom-center"
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
		)
}

export default RoomList