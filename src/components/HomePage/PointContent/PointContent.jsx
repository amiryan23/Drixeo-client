import s from './PointContent.module.scss'
import DrixeoStar from './../../../helpers/drixeoStar'
import CountUp from 'react-countup';
import {useEffect,useRef,useContext} from 'react'
import { MyContext } from './../../../context/Context'



const PointContent = () => {

	const {  thisUser  } = useContext(MyContext);

	const animPoints = useRef()
	const timerRef = useRef()

	useEffect(()=>{

		if(animPoints.current){
		animPoints.current.classList.add(s.animPoints)
		timerRef.current = setTimeout(()=>{
		animPoints.current.classList.remove(s.animPoints)
		},1500)
		}

		return ()=>{
			clearTimeout(timerRef.current)
		}
	},[thisUser?.points])


	return (
				<div className={s.pointContent} ref={animPoints}>
					<CountUp end={thisUser?.points} preserveValue={true}/>
					<DrixeoStar/>
				</div>
		)
}

export default PointContent