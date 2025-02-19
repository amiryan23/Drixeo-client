export const calculateLevel = (exp) => {
   if (exp < 100){
   return 0
 } else if (exp >= 100 && exp < 300){
   return 1
 } else if (exp >= 300 && exp < 600) {
  return 2;
} else if (exp >= 600 && exp < 1000) {
return 3;
} else if (exp >= 1000 && exp < 2500) {
  return 4;
} else if  (exp >= 2500) {
 return 5;
}
  
};


export const calculateLevelChat = (exp) => {
   if (exp < 100){
   return null
 } else if (exp >= 100 && exp < 300){
   return "Ⅰ"
 } else if (exp >= 300 && exp < 600) {
  return "Ⅱ";
} else if (exp >= 600 && exp < 1000) {
return "Ⅲ";
} else if (exp >= 1000 && exp < 2500) {
  return "Ⅳ";
} else if  (exp >= 2500) {
 return "Ⅴ";
}
  
};