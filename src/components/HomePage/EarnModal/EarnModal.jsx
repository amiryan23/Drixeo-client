import s from './EarnModal.module.scss'
import {useEffect,useState,useContext} from 'react'
import { MyContext } from './../../../context/Context'
import { motion,AnimatePresence} from 'framer-motion';
import { TiStarFullOutline } from "react-icons/ti";
import { FaCheckCircle , FaLongArrowAltRight} from "react-icons/fa";
import DrixeoStar from './../../../helpers/drixeoStar'
import axios from "axios";
import { Oval } from 'react-loader-spinner'
import { RiVipCrownFill } from "react-icons/ri";
import { MdMeetingRoom } from "react-icons/md";
import { FaTelegramPlane } from "react-icons/fa";

const EarnModal = ({openEarn,setOpenEarn,toast,t}) => {

const [linkTask,setLinkTask] = useState(false)
const [taskLoading,setTaskLoading] = useState(null)


const {  thisUser,setThisUser,tasks,setTasks} = useContext(MyContext);

const token = sessionStorage.getItem('__authToken');

const thisUserId = window.Telegram.WebApp.initDataUnsafe?.user?.id

const telegramPremium =  window.Telegram.WebApp.initDataUnsafe?.user?.is_premium || null

const fetchTasks = async () => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/tasks`, { 
    	userId:thisUserId
    	 },
      { headers: {
    			'Authorization': `Bearer ${token}`
  			}
  		});
    console.log("Задания:", data);
    setTasks(data)
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
  }
};

useEffect(()=>{
	fetchTasks()
},[])


const claimTask = async (taskId,reward) => {
	setTaskLoading(taskId)
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/tasks/claim/${taskId}`, { 
    	userId:thisUserId 
    },
    { headers: {
    			'Authorization': `Bearer ${token}`
  			}
  		});
    fetchTasks()
  	setTaskLoading(null)
  	setThisUser({...thisUser,points:thisUser?.points + reward})
		toast.info(`${t(`You have received`)} ${reward} Drixeo-Stars`,{ 
         		icon:<TiStarFullOutline size="25" color="whitesmoke"/> 
         	})  	
  	window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
  } catch (error) {
  	setTaskLoading(null)
    console.error("Ошибка выполнения задания:", error.response?.data || error);
  }
};

const linkTasks = tasks 
? tasks.filter(task=> task.type === "link").map(task=> 		 <motion.div 
		 initial={{ opacity: 0 , scale:0.95 }}
         animate={{ opacity: 1 , scale:1 }}
         exit={{ opacity: 0  , scale:0.7}}
         transition={{ duration: 0.2 }}		 
		 className={s.joinTasks}>
		 	<span className={s.item1}><img src={task.imgUrl} alt="" /></span>
		 	<span className={s.item2}>{task.description}</span>
		 	<span className={s.item3}>
		 	+{task.reward}
		 	<DrixeoStar/>
		 	</span>
		 	<span className={s.item4}>
		 	{task.is_completed ? 
		 	<span className={s.completed}><FaCheckCircle/></span>
		 	: linkTask 
		 	? <button disabled={taskLoading === task.id} 
		 	className={s.claimBtn} 
		 	onClick={()=>{claimTask(task.id,task.reward)}}>
		 	{taskLoading === task.id 
		 	? <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/> 
		 	: "Claim"}</button> 
		 	: <button disabled={taskLoading === task.id} className={s.goToTaskBtn}
		 	onClick={()=>{
		 		setTaskLoading(task.id)
		 		window.Telegram.WebApp.openTelegramLink(task.link)
		 		setTimeout(()=>{setLinkTask(true);setTaskLoading(false)},5000)
		 	}}>{taskLoading === task.id 
		 	?  <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>  
		 	: <FaLongArrowAltRight size="16" />}
		 	</button>}
		 	</span>
		 </motion.div> ) 
: <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>


const premiumTask = tasks 
? tasks.filter(task=> task.type === "premium").map(task=> 		 <motion.div 
		 initial={{ opacity: 0 , scale:0.95 }}
         animate={{ opacity: 1 , scale:1 }}
         exit={{ opacity: 0  , scale:0.7}}
         transition={{ duration: 0.2 }}		 
		 className={s.joinTasks}>
		 	<span className={s.item1}><RiVipCrownFill/></span>
		 	<span className={s.item2}>{task.description}</span>
		 	<span className={s.item3}>
		 	+{task.reward}
		 	<DrixeoStar/>
		 	</span>
		 	<span className={s.item4}>
		 	{task.is_completed ? 
		 	<span className={s.completed}><FaCheckCircle/></span>
		 	: thisUser?.is_premium 
		 	? <button disabled={taskLoading === task.id} 
		 	className={s.claimBtn} 
		 	onClick={()=>{claimTask(task.id,task.reward)}}>
		 	{taskLoading === task.id 
		 	? <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/> 
		 	: "Claim"}</button> 
		 	: <button disabled={taskLoading === task.id} className={s.goToTaskBtn}
		 	onClick={()=>{
		 		setTaskLoading(task.id)
		 		
		 		setTimeout(()=>{setLinkTask(true);setTaskLoading(false)},5000)
		 	}}>{taskLoading === task.id 
		 	?  <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>  
		 	: <FaLongArrowAltRight size="16" />}
		 	</button>}
		 	</span>
		 </motion.div> ) 
: <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>


const tpremiumTask = tasks 
? tasks.filter(task=> task.type === "tpremium").map(task=> 		 <motion.div 
		 initial={{ opacity: 0 , scale:0.95 }}
         animate={{ opacity: 1 , scale:1 }}
         exit={{ opacity: 0  , scale:0.7}}
         transition={{ duration: 0.2 }}		 
		 className={s.joinTasks}>
		 	<span className={s.item1}><FaTelegramPlane/></span>
		 	<span className={s.item2}>{task.description}</span>
		 	<span className={s.item3}>
		 	+{task.reward}
		 	<DrixeoStar/>
		 	</span>
		 	<span className={s.item4}>
		 	{task.is_completed ? 
		 	<span className={s.completed}><FaCheckCircle/></span>
		 	: telegramPremium
		 	? <button disabled={taskLoading === task.id} 
		 	className={s.claimBtn} 
		 	onClick={()=>{claimTask(task.id,task.reward)}}>
		 	{taskLoading === task.id 
		 	? <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/> 
		 	: "Claim"}</button> 
		 	: <button disabled={taskLoading === task.id} className={s.goToTaskBtn}
		 	onClick={()=>{
		 		setTaskLoading(task.id)
		 		
		 		setTimeout(()=>{setLinkTask(true);setTaskLoading(false)},5000)
		 	}}>{taskLoading === task.id 
		 	?  <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>  
		 	: <FaLongArrowAltRight size="16" />}
		 	</button>}
		 	</span>
		 </motion.div> ) 
: <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>



const roomTask = tasks 
? tasks.filter(task=> task.type === "room").map(task=> 		 <motion.div 
		 initial={{ opacity: 0 , scale:0.95 }}
         animate={{ opacity: 1 , scale:1 }}
         exit={{ opacity: 0  , scale:0.7}}
         transition={{ duration: 0.2 }}		 
		 className={s.joinTasks}>
		 	<span className={s.item1}><MdMeetingRoom/></span>
		 	<span className={s.item2}>{task.description}</span>
		 	<span className={s.item3}>
		 	+{task.reward}
		 	<DrixeoStar/>
		 	</span>
		 	<span className={s.item4}>
		 	{task.is_completed ? 
		 	<span className={s.completed}><FaCheckCircle/></span>
		 	: thisUser?.lastRoomCreation 
		 	? <button disabled={taskLoading === task.id} 
		 	className={s.claimBtn} 
		 	onClick={()=>{claimTask(task.id,task.reward)}}>
		 	{taskLoading === task.id 
		 	? <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/> 
		 	: "Claim"}</button> 
		 	: <button disabled={taskLoading === task.id} className={s.goToTaskBtn}
		 	onClick={()=>{
		 		setTaskLoading(task.id)
		 		
		 		setTimeout(()=>{setLinkTask(true);setTaskLoading(false)},5000)
		 	}}>{taskLoading === task.id 
		 	?  <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>  
		 	: <FaLongArrowAltRight size="16" />}
		 	</button>}
		 	</span>
		 </motion.div> ) 
: <Oval visible={true} height="13" width="13" color="whitesmoke" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass=""/>

	return (
		<AnimatePresence>
		{openEarn && 
		<motion.div
		 className={s.taskContainer}
		 key="earnModal"
		 initial={{ opacity: 0 , height:0 }}
         animate={{ opacity: 1 , height:150 }}
         exit={{ opacity: 0 ,  height:0}}
         transition={{ duration: 0.5 }}
		 >
		{linkTasks}
		{roomTask}
		{premiumTask}
		{tpremiumTask}
		</motion.div>}
		</AnimatePresence>
		)
}

export default EarnModal