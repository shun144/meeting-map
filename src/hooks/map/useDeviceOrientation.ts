// import React, { useEffect, useState } from 'react'

// const useDeviceOrientation = () => {
//   const [text, setText] = useState("");
//   const [iosFlag, setIosFlag] = useState(false);
//   const [isDisabled, setIsDisabled] = useState(true);
//   const ua = ["iPod", "iPad", "iPhone"];

//   useEffect(() => {
//     if (window.DeviceOrientationEvent && "ontouchstart" in window) {
//       //mobile
//       for (let i: number = 0; i < ua.length; i++) {
//         if (window.navigator.userAgent.indexOf(ua[i]) > 0) {
//           setIosFlag(true);
//           setIsDisabled(false);
//           setText("ボタンを押してください!");
//           break;
//         }
//       }

//       if (!iosFlag && window.navigator.userAgent.indexOf("Android") > 0) {
//         setIsDisabled(false);
//         setText("ボタンを押してください!");
//       }
//     } else {
//       //pc
//       setText("このデバイスでは対応しておりません");
//     }
//   }, []);

//   return (
//     <div>useDeviceOrientation</div>
//   )
// }

// export default useDeviceOrientation
