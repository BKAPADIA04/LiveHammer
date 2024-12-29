import React,{useCallback, useState,useEffect} from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import '../css/agora.css';
// require("dotenv").config();

export default function Agora() {

    // const appID = process.env.AGORA_API_ID;
    const appID = '846577752fa84fcbabed82e0fc1cfd6d';
    console.log(appID);
    // const appCertificate = process.env.AGORA_PRIMARY_CERTIFICATE;
    // const agoraToken = process.env.AGORA_TEMP_TOKEN;
    const agoraToken = "006846577752fa84fcbabed82e0fc1cfd6dIAAWACFRDDXgdgk+tlsUCOOzp07B2d/E8bAcoP5QLy5cGwx+f9gAAAAAIgACrHS3bjByZwQAAQBuMHJnAgBuMHJnAwBuMHJnBABuMHJn";
    console.log(agoraToken);
    const channel = 'test';
    const uid = 0;

    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    const [localTracks, setLocalTracks] = useState([]);
    let remoteUsers = {};

    const joinAndDisplayLocalStream = useCallback(async() => {

        client.on('user-published', handleUserJoined);

        await client.join(appID, channel, agoraToken, uid);
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        await client.publish([audioTrack, videoTrack]);
        setLocalTracks([audioTrack, videoTrack]);
        videoTrack.play(`local-player`);
    },[agoraToken, appID, client]);

    const cancelCall = useCallback(async() => {
        await client.leave();
        localTracks.forEach(track => track.stop());
    },[client, localTracks]);

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
        setIsMicOn(!isMicOn);
      };
    
      const toggleCamera = () => {
        setIsCameraOn(!isCameraOn);
      };
    

    //   useEffect(() => {
    //     joinAndDisplayLocalStream();
    //     // Cleanup: leave channel when component unmounts
    //     return () => {
    //       client.leave();
    //       localTracks.forEach(track => track.stop());
    //     };
    //   }, [client, joinAndDisplayLocalStream, localTracks]);

    return (
        <>  
        <div className="video-chat-container">
    {/* Header */}
    <div className="header">
        <h1>📺 LiveHammer</h1>
    </div>

    {/* Auctioneer's Stream */}
    <div className="auctioneer-container">
        <div id="auctioneer-player" className="video-box auctioneer-player">
            <span className="stream-label">Auctioneer</span>
        </div>
    </div>

    {/* Local Stream */}
    <div className="local-container">
        <div id="local-player" className="video-box-1 local-player">
            <span className="status-indicator"></span>
        </div>
    </div>

    {/* Remote Users Carousel */}
    <div className="remote-users-container">
        <div id="remote-player-container" className="remote-users-carousel">
            {/* Render Remote User Boxes Dynamically */}
        </div>
    </div>

    {/* Controls */}
    <div className="controls">
        <button className="control-button" onClick={joinStream} >📞 Call</button>
        <button className="control-button end-call" onClick={cancelCall}>❌ Cancel</button>
    </div>
</div>
    
        </>
      );    
}
