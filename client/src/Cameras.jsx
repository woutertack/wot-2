import React from 'react';
import './Cameras.css';

const Cameras = () => {
 return (
 <>
 <h1>Camera overzicht</h1>
   <div className='cameras'>
     <div className='camera'>
       <p className='cameraTitle'>Camera 1</p>
      <img id="stream1" src="http://192.168.0.121:81/stream" crossOrigin="" />
            {/* <img id="stream" className='camera1' src="http://192.168.50.254:81/stream" crossOrigin=""></img> */}
     </div>
    
   </div>
 </>



 );
};

export default Cameras;



{/* <div class="camera-container">
      <div class="camera camera-blink-1">
        <!-- <img id="stream1" src="http://192.168.0.121:81/stream" crossorigin="" onerror="handleError(this)"> -->
        <img id="stream" src="http://192.168.50.254:81/stream" crossorigin="">
        <p>El CAMERA 1</p>
    </div>
    <div class="camera camera-blink-2">
        <!-- <img id="stream2" src="http://192.168.0.121:81/stream" crossorigin="" onerror="handleError(this)"> -->
        <img id="stream" src="http://192.168.50.83:81/stream" crossorigin="">
        <p>EL CAMERA 2</p>
    </div>
    <div class="camera camera-blink-3">
        <!-- <img id="stream3" src="http://192.168.0.121:81/stream" crossorigin="" onerror="handleError(this)"> -->
        <img id="stream" src="http://192.168.50.44:81/stream" crossorigin="">
        <p>EL CAMERA 3</p>
    </div>
    <div class="camera camera-blink-4">
        <!-- <img id="stream4" src="http://192.168.0.121:81/stream" crossorigin="" onerror="handleError(this)"> -->
        <img id="stream" src="http://192.168.50.182:81/stream" crossorigin="">
        <p>EL CAMERA 4</p>
    </div> */}