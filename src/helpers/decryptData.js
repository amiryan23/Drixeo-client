import CryptoJS from 'crypto-js';

export const decryptData = (encryptedData, secretKey) => {
  try {
    const [ivBase64, encryptedText] = encryptedData.split(":"); 
    const iv = CryptoJS.enc.Base64.parse(ivBase64); 
    const key = CryptoJS.SHA256(secretKey); 

    const bytes = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) throw new Error("Ошибка расшифровки");

    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Ошибка расшифровки данных:", error);
    return null;
  }
};

export const encryptData = (data, secretKey) => {
  const iv = CryptoJS.lib.WordArray.random(16); 
  const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, " ")); 

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return JSON.stringify({
    iv: CryptoJS.enc.Base64.stringify(iv),
    encryptedData: encrypted.toString(),
  });
};