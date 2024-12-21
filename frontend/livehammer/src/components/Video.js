import React, { useCallback, useEffect,useState } from 'react'
import '../css/Video.css';
import { useSocket } from '../context/SocketProviderContext';
import ReactPlayer from 'react-player';

export default function Video() {

  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  const handleJoinedUser = useCallback((data) => {
    const {email,socketId} = data;
    console.log(`${email} joined the room`);
    setRemoteSocketId(socketId);
  },[setRemoteSocketId]);

  const handleCall = useCallback(async() => {
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
    setLocalStream(stream);
  },[setLocalStream]);

  useEffect(() => {
    socket.on('user:joined',(data) => {
      handleJoinedUser(data);
  });

  return () => {
    socket.off('user:joined',(data) => {
      handleJoinedUser(data);
    });
  }
},[socket,handleJoinedUser]);

  return (
    <>
  {/* Conference Room Header */}
  <div className="container text-center my-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body">
            <h1 className="card-title mb-4">Conference Room</h1>
            <h4
              className={`mb-4 ${
                remoteSocketId ? "text-success" : "text-danger"
              }`}
            >
              {remoteSocketId ? "Connected" : "No One In The Room"}
            </h4>
            {remoteSocketId && (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleCall}
              >
                Start Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Local Stream Section */}
  <div className="container my-4">
    <div className="row justify-content-center mb-2">
      <div className="col-md-6 text-center">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title">Local Stream</h4>
            {localStream ? (
              <ReactPlayer
                playing
                muted
                height="50vh"
                width="100%"
                url={localStream}
                className="rounded"
              />
            ) : (
              <p className="text-muted">No local stream available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Remote Streams Section */}
  {/*
  <div className="container my-4">
    <div className="row">
      <h4 className="mb-3">Remote Streams</h4>
      {remoteStreams && remoteStreams.length > 0 ? (
        remoteStreams.map((stream, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <div className="card shadow">
              <div className="card-body text-center">
                <h6 className="card-title">User {index + 1}</h6>
                <ReactPlayer
                  playing
                  height="200px"
                  width="100%"
                  url={stream}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted">No remote streams available</p>
      )}
    </div>
  </div>
  */}
</>

  )
}
