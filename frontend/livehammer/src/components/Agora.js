import React,{useCallback, useState,useEffect} from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
// require("dotenv").config();

export default function Agora() {

    // const appID = process.env.AGORA_API_ID;
    const appID = '846577752fa84fcbabed82e0fc1cfd6d';
    console.log(appID);
    // const appCertificate = process.env.AGORA_PRIMARY_CERTIFICATE;
    // const agoraToken = process.env.AGORA_TEMP_TOKEN;
    const agoraToken = "006846577752fa84fcbabed82e0fc1cfd6dIADBXYm7D+MyiYyHvV2Jl5ekUTz7dZdNCzj6le0PDDm7dAx+f9gAAAAAIgBEZmcMfUtpZwQAAQB9S2lnAgB9S2lnAwB9S2lnBAB9S2ln";
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
        console.log("User Joined: ", user);
        remoteUsers[user.uid] = user ;
        await client.subscribe(user, mediaType)
        if(mediaType === 'video')
        {
            const videoTrack = user.videoTrack;
            videoTrack.play(`remote-player`);
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
        <div>
        <button onClick={joinStream}>CALL</button>
        <button onClick={cancelCall}>Cancel</button>
        <h2>Agora Video Chat</h2>
        <div id="local-player" className = 'col-12 col-md-8' style={{ aspectRatio: '16/9',
        backgroundColor: '#000',
        borderRadius: '8px',
        overflow: 'hidden'}}>
        </div>
        <div id="remote-player" className = 'col-12 col-md-8' style={{ aspectRatio: '16/9',
            backgroundColor: '#000',
            borderRadius: '8px',
            overflow: 'hidden'}}></div>
            {/* Other UI elements */}
        </div>
      );    
}
