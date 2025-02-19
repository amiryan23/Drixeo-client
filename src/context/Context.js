import React, { createContext, useEffect,  useState ,useMemo} from 'react';
import axios from 'axios'
import { useTranslation } from 'react-i18next';
import {decryptData} from './../helpers/decryptData'




const MyContext = createContext();


const MyContextProvider = ({ children }) => {

  const [thisUser, setThisUser] = useState(null);
  const [activeLink,setActiveLink] = useState("home")
  const [loader,setLoader] = useState(true)
  const [isLoaded,setIsLoaded] = useState(0)
  const [userLevelInfo,setUserLevelInfo] = useState(null)

const { i18n } = useTranslation();


useEffect(()=>{

    window.Telegram.WebApp.disableVerticalSwipes()
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.lockOrientation()

const tg = window.Telegram.WebApp


    const userData =  {
      userId: tg?.initDataUnsafe?.user?.id,
      username: tg?.initDataUnsafe?.user?.username,
      first_name: tg?.initDataUnsafe?.user?.first_name,
      last_name: tg?.initDataUnsafe?.user?.last_name,
      photo_url:tg?.initDataUnsafe?.user?.photo_url,
      initData: tg?.initData

    };

   axios.post(`${process.env.REACT_APP_API_URL}/auth/miniapp`, userData)
      .then(response => {
        const token = response.data.token;
        sessionStorage.setItem('__authToken', token);

        const userData = response.data.userData

        const decryptUserData = decryptData(userData,process.env.REACT_APP_SECRET_KEY_CODE)

        const newResponeData = {...decryptUserData,gifts:JSON.parse(decryptUserData?.gifts),custom_settings:JSON.parse(decryptUserData?.custom_settings)}
        
        setThisUser(newResponeData);
       setTimeout(()=>{ setIsLoaded((prevIsLoaded)=>prevIsLoaded + 50) },1000)
      })
      .catch(error => {
        console.error('Error:', error);
      });

if(tg?.initDataUnsafe?.user?.language_code === "ru"){
  i18n.changeLanguage("ru")
} else {
  i18n.changeLanguage("en")
}

},[])

useEffect(()=>{
  if(isLoaded >= 100){
    setTimeout(()=>{ setLoader(false) },1000)
  }
},[isLoaded])

 const contextValue = useMemo(() => ({
      thisUser,
      setThisUser,
      activeLink,
      setActiveLink,
      loader,
      isLoaded,
      setIsLoaded,
      userLevelInfo,
      setUserLevelInfo
        }), [thisUser,activeLink,loader,isLoaded,setIsLoaded,userLevelInfo]);

  return (
    <MyContext.Provider 
    value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
