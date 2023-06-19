import { Player } from "@lottiefiles/react-lottie-player";


function ErrorAnimation({show}) {
    return (
        show && (
            <>
            <div className="c-loading">
                <h1>
                    <strong className="color--blue">Oops!</strong> Something went wrong on our side...
                </h1>
            </div>
            <Player
                className='c-lottie'
                autoplay={true}
                loop={true}
                controls={false}
                keepLastFrame={true}
                src={`assets/lottie/notFound.json`}
                style={{ height: '40rem', width: '40rem' }}
            />
            </>
        )
    )
}

export default ErrorAnimation;