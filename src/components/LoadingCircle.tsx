import React, { useEffect, useRef } from 'react';

const LoadingCircle = ({ estimatedTimeout }) => {
    const circleRef = useRef(null);

    useEffect(() => {
        if (circleRef.current) {
            circleRef.current.style.animationDuration = `${estimatedTimeout}s`;
        }
    }, [estimatedTimeout]);

    return (
        <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg"
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path ref={circleRef} className="circle"
                strokeDasharray="0, 100"
                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            >
            </path>
        </svg>
    )
}

export default LoadingCircle;
