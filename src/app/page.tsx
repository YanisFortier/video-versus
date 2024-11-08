"use client";

import React, {useEffect, useState} from 'react';
import {VideoItem} from "@/app/models/videoItem";
import {getNewVideos} from "@/app/utils/VideoRandomizer";
import {handleVote} from "@/app/utils/VoteHandler";

const Page = () => {
    const [video1, setVideo1] = useState<VideoItem>();
    const [video2, setVideo2] = useState<VideoItem>();

    // Charger les vidéos lors du montage
    useEffect(() => {
        async function loadVideos() {
            await getNewVideos(setVideo1, setVideo2);
        }

        loadVideos();
    }, []);

    return (<div className="container d-flex justify-content-center align-items-center">
            <div className="row justify-content-evenly w-100">
                <div className="col-4 text-center">
                    <div id="video1" className="video">
                        {video1 && (<iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${video1.videoId}`}
                                allowFullScreen
                            ></iframe>)}
                    </div>
                    <button
                        type="button"
                        className="button-gauche"
                        onClick={() => handleVote(video1 as VideoItem, video2 as VideoItem, setVideo1, setVideo2)}
                    >
                        👍
                    </button>
                </div>
                <div className="col-4 text-center">
                    <div id="video2" className="video">
                        {video2 && (<iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${video2.videoId}`}
                                allowFullScreen
                            ></iframe>)}
                    </div>
                    <button
                        type="button"
                        className="button-droite"
                        onClick={() => handleVote(video2 as VideoItem, video1 as VideoItem, setVideo1, setVideo2)}
                    >
                        👍
                    </button>
                </div>
            </div>
        </div>);
};

export default Page;
