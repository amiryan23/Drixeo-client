import './App.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage'
import Room from './components/Room/Room'
import RoomList from './components/RoomList/RoomList'
import React,{useContext,useEffect} from 'react'
import { MyContext } from './context/Context'
import {urls} from './assets/urlAssets.js'

function App() {

const { setIsLoaded } = useContext(MyContext);


  useEffect(() => {


  const fetchImages = async () => {
     try {
      await Promise.all(
        urls?.map(
          (url) =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.src = url; 
              img.onload = () => resolve(url); 
              img.onerror = (err) => reject(`Ошибка загрузки изображения: ${url}`);
            })
        )
      );
     
      setIsLoaded((prevIsLoaded)=>prevIsLoaded + 50)
    } catch (error) {
      console.error("Не удалось загрузить изображения:", error);
    }
  };


  fetchImages();
}, []);


  return (
    <BrowserRouter>
    <div className="App">
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path="/room/:roomId" element={<Room/>} />
      <Route path='/roomlist' element={<RoomList/>} />
    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
