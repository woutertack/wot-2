import React, { useEffect, useContext } from 'react';
import { socket } from '../socket';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from "react-router-dom";
// import ControlButtonContext from '../ControlButtonContext';
// import { ControlButton } from '../enums';

export function ConnectionManager() {
  // const { connect, disconnect } = useSocket();
  // const navigate = useNavigate();
  // // const controlButtonContext = useContext(ControlButtonContext);

  // useEffect(() => {
  //   // connect with socket.io
  //   connect();

    /**
     * Whenever the page is changed, navigate to the new page
     */
    // socket.on('change-page', (payload) => {
    //   navigate(`/${payload}`);
    // })

    // socket.on('challengeComplete1', (payload) => {
    //   console.log(payload);
    //   if(payload){
    //     socket.emit('challengeComplete1', payload);
    //   }
      
    // })
    // socket.on('challengeComplete2', (payload) => {
    //   console.log("challenge completed 2");
    // })
    // socket.on('challengeComplete3', (payload) => {
    //   console.log("challenge completed 3");
    // })
    // socket.on('challengeComplete4', (payload) => {
    //   console.log("challenge completed 4");
    // })
    // socket.on('challengeComplete5', (payload) => {
    //   console.log("challenge completed 5");
    // })

    // /**
    //  * Whenever a button is pressed, call the corresponding function
    //  */
    // socket.on('button-pressed', (payload) => {
    //   const button = Number(payload.button) as ControlButton;
    //   switch(button) {
    //     case ControlButton.LEFT:
    //       controlButtonContext.onLeftButtonPressed();
    //       break;
    //     case ControlButton.MIDDLE:
    //       controlButtonContext.onMiddleButtonPressed();
    //       break;
    //     case ControlButton.RIGHT:
    //       controlButtonContext.onRightButtonPressed();
    //       break;
    //     default:
    //       break;
    //   }
    // })

    // cleanup
  //   return () => {
  //     // socket.off('button-pressed');
  //     // socket.off('change-page');
  //     disconnect();
  //   }
  // }, []);

  return (<div></div>);
}