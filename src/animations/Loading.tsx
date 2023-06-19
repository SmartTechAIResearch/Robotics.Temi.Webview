import { Player } from "@lottiefiles/react-lottie-player";


function LoadingAnimation({show}) {
    return (
        show && (
            <>
            <div className="c-loading">
                <h1>
                    Loading the locations <strong className="color--blue">...</strong>
                </h1>
            </div>
            <Player
                className='c-lottie'
                autoplay={true}
                loop={true}
                controls={false}
                keepLastFrame={true}
                src={`assets/lottie/loading.json`}
                style={{ height: '40rem', width: '40rem' }}
            />
            </>
        )
    )
}

export default LoadingAnimation;