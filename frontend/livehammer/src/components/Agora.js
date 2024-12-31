import React,{useCallback, useState,useEffect} from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useNavigate } from "react-router-dom";
import '../css/agora.css';
import { useSocket } from '../context/SocketProviderContext';
// require("dotenv").config();

export default function Agora() {

    // const appID = process.env.AGORA_API_ID;
    const appID = '846577752fa84fcbabed82e0fc1cfd6d';
    console.log(appID);
    // const appCertificate = process.env.AGORA_PRIMARY_CERTIFICATE;
    // const agoraToken = process.env.AGORA_TEMP_TOKEN;
    const agoraToken = "006846577752fa84fcbabed82e0fc1cfd6dIAB/eT6dYV71CiL84xN4FCEqHDl26B/94yP9/7FLxMSIjwx+f9gAAAAAIgDPOpKykYZ1ZwQAAQCRaFVpAgCRaFVpAwCRaFVpBACRaFVp";
    console.log(agoraToken);
    const channel = 'test';
    const uid = 0;

    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    const [localTracks, setLocalTracks] = useState([]);
    let remoteUsers = {};


    const socket = useSocket();

    useEffect(() => {
        socket.on('agora:joined', (data) => {
            console.log(data);
        });
        return () => {
            socket.off('agora:joined', (data) => {
                console.log(data);
            });
        }
    },[socket]);

    const joinAndDisplayLocalStream = useCallback(async() => {

        client.on('user-published', handleUserJoined);
        // client.on("user-unpublished", handleUserLeft);

        await client.join(appID, channel, agoraToken, uid);

        // const cameras = await AgoraRTC.getCameras();
        // console.log(cameras);
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        await client.publish([audioTrack, videoTrack]);
        setLocalTracks([audioTrack, videoTrack]);
        videoTrack.play(`local-player`);
    },[agoraToken, appID, client]);

    const handleUserLeft = async(user) => {
        const uid = user.uid;
        // console.log("User Left: ", uid);
        // const playerContainer = document.getElementById(`remote-player-${uid}`);
        // if(playerContainer)
        // {
            // playerContainer.remove();
        // }
        // delete remoteUsers[user.uid];
    }

    const navigate = useNavigate();
    const cancelCall = useCallback(async (user) => {
        const playerContainer = document.getElementById(`remote-player-${uid}`);
        if (playerContainer) {
            playerContainer.remove();  // Remove the video box from the UI
        }
        delete remoteUsers[user.uid];
        try {
            // Leave the channel
            await client.leave();
    
            // Stop and release local tracks
            if (localTracks.length > 0) {
                localTracks.forEach((track) => {
                    track.stop(); // Stop the track
                    track.close(); // Release the track
                });
            }
    
            // Remove all remote user elements from the DOM
            const remotePlayerContainer = document.getElementById('remote-player-container');
            if (remotePlayerContainer) {
                remotePlayerContainer.innerHTML = ''; // Clear all remote user elements
            }
    
            // Reset the local state
            setLocalTracks([]);
            setIsMicOn(true);
            setIsCameraOn(true);
            setIsJoined(false);
    
            console.log('Call canceled and resources cleaned up.');
        } catch (error) {
            console.error('Error leaving the call:', error);
        }
        navigate('/user/dashboard');
    }, [client, localTracks, navigate]);
    

    const joinStream = async() => {
        await joinAndDisplayLocalStream();
    }

    const handleUserJoined = async(user,mediaType) => {
        const uid = user.uid;
        console.log("User Joined: ", uid);

        let playerContainer = document.getElementById(`remote-player-${uid}`);
        if(!playerContainer)
        {
            playerContainer = document.createElement('div');
            playerContainer.className = 'col-12 col-md-8';
            playerContainer.id = `remote-player-${uid}`;
            playerContainer.style = `
              aspect-ratio: 16/9;
              background-color: #000;
              border-radius: 8px;
              overflow: hidden;
              margin: 10px;
            `;
            document.getElementById('remote-player-container').appendChild(playerContainer);
        }
        remoteUsers[user.uid] = user ;
        await client.subscribe(user, mediaType)
        if(mediaType === 'video')
        {
            const videoTrack = user.videoTrack;
            videoTrack.play(`remote-player-${uid}`);
        }

        if(mediaType === 'audio')
        {
            const audioTrack = user.audioTrack;
            audioTrack.play();
        }

        socket.emit('agora:join', {
            channel: channel,
            uid:uid
        });
    }


    const [isJoined, setIsJoined] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);


    const handleJoin = () => {
        setIsJoined(true);
      };
    
      const handleLeave = () => {
        setIsJoined(false);
      };
    
      const toggleMic = () => {
        if (localTracks[0]) { // Assuming localTracks[0] is the audio track
            if (isMicOn) {
                localTracks[0].setEnabled(false); // Mute the microphone
            } else {
                localTracks[0].setEnabled(true); // Unmute the microphone
            }
            setIsMicOn(!isMicOn);
        }

      };
    
      const toggleCamera = () => {
        if (localTracks[1]) { // Assuming localTracks[1] is the video track
            if (isCameraOn) {
                localTracks[1].setEnabled(false); // Turn off the camera
            } else {
                localTracks[1].setEnabled(true); // Turn on the camera
            }
            setIsCameraOn(!isCameraOn);
        }
      };


    return (
        <>  
        <div className="video-chat-container">
    {/* Header */}
    <div className="header">

        <h1 className='text-white fw-bold text-center p-2'>📺 LiveHammer 💸 💰 🔨</h1>
    </div>

    {/* Auctioneer's Stream */}
    <div className="auctioneer-container">
        <div id="auctioneer-player" className="video-box auctioneer-player border border-dark">
            <span className="stream-label border border-dark">Auctioneer</span>
        </div>
    </div>

    {/* Local Stream */}
    <div className="local-container border border-dark">
        <div id="local-player" className="video-box-1 local-player">
            <span className="status-indicator"></span>
            <span className="stream-label1 border border-dark">Bhavya Kapadia</span>
        </div>
    </div>

    {/* Remote Users Carousel */}
    <div className="remote-users-container">
      <h4 className="text-black fw-bold text-center mb-3 border-bottom pb-2">Remote Users</h4>
        <div id="remote-player-container" className="remote-users-carousel border border-dark">
            {/* Render Remote User Boxes Dynamically */}
            <span className="stream-label2">User</span>
            <span className="status-indicator"></span>
        </div>
    </div>

    {/* Controls */}
    <div className="controls">
        <button className="control-button btn-lg" onClick={joinStream}>Call</button>
            <div className="d-flex justify-content-center align-items-center gap-3">
                {/* Toggle Microphone Button */}
                <button 
                    className={`btn ${isMicOn ? 'btn-danger' : 'btn-success'} d-flex btn-lg align-items-center`} 
                    onClick={toggleMic}
                >
                    <i className={`bi ${isMicOn ? 'bi-mic-fill' : 'bi-mic-mute-fill'} btn-lg me-2`} ></i>
                    {isMicOn ? 'Mute' : 'Unmute'}
                </button>

                {/* Toggle Camera Button */}
                <button 
                    className={`btn ${isCameraOn ? 'btn-danger' : 'btn-success'} d-flex align-items-center`} 
                    onClick={toggleCamera}
                >
                    <i className={`bi ${isCameraOn ? 'bi-camera-video-fill' : 'bi-camera-video-off-fill'} me-2`}></i>
                    {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                </button>
            </div>
            <button className="control-button end-call" onClick={cancelCall}>Cancel</button>
        </div>
    </div>
    
    </>
      );    
}
