import React from 'react';
import '../css/CourseCard.css'

const VideoCard = ({video}) => {
    // const blob = new Blob([Int8Array.from(props.video.data.data)], { type: props.video.contentType });
    // const video= window.URL.createObjectURL(blob);

    return (
        <div className="video-card">
            <div className="">
                <video src={video.link} controls width={300} />
            </div>
            <div className="video-details">
                {console.log(video.name)}
                <p>{video.name}</p>
                {/* <p>{course.category}</p> */}
                {/* <p>{course.duration} months</p> */}
                {/* <p>{course.description}</p> */}
            </div>
        </div>
    );
};

export default VideoCard;
