import React from 'react';
import './Cameras.css';

const Cameras = () => {
 return (
 <>
 <h1>Camera overzicht</h1>
   <div className='cameras'>
     <div className='camera'>
       <p className='cameraTitle'>Camera 1</p>
       <img className="camera1" src="https://via.placeholder.com/150x55" alt="Camera 1" />
     </div>
     <div className='camera'>
       <p className='cameraTitle'>Camera 2</p>
       <img className="camera2" src="https://via.placeholder.com/150x55" alt="Camera 2" />
     </div>
     <div className='camera'>
       <p className='cameraTitle'>Camera 3</p>
       <img className="camera3" src="https://via.placeholder.com/150x55" alt="Camera 3" />
     </div>
     <div className='camera'>
       <p className='cameraTitle'>Camera 4</p>
       <img className="camera4" src="https://via.placeholder.com/150x55" alt="Camera 4" />
     </div>
   </div>
 </>

 );
};

export default Cameras;
