import s from './ProjectInfo.module.scss'
import { useTranslation } from 'react-i18next';

const ProjectInfo = () => {

	const { t } = useTranslation();

	return (
		<div className={s.projectInfoContainer}>
			<span className={s.link1} 
			onClick={()=>{
				window.Telegram.WebApp.openTelegramLink("https://t.me/drixeo")
			}}>Drixeo Channel > </span>
			<span className={s.link1} onClick={()=>{
				window.Telegram.WebApp.openLink("https://telegra.ph/Drixeo-02-18-2",{try_instant_view:true})
			}}>{t("How to use ?")} > </span>
			<span className={s.link1} onClick={()=>{
				window.Telegram.WebApp.openLink("https://telegra.ph/Terms-of-Use-for-Drixeo-02-18",{try_instant_view:true})
			}}>{t("Terms & Rules")} > </span>
		</div>
		)
}

export default ProjectInfo