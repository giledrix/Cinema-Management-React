import Background from '../../Style/images/login_background.jpg';
import Typewriter from 'typewriter-effect';
import '../../Style/Home.css';

function Home_Comp() {

    return (

        <div style={{

            backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,1)),url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            display: 'flex', justifyContent: 'left', alignItems: 'left', height: '100vh'
        }}>

            <br /><br /><br /><br /><br />

            <div style={{
                color: '#fff',
                textAlign: 'left',
                margin: '60px'
            }}>

                <Typewriter
                    options={{
                        loop: true,
                    }}
                    onInit={(typewriter) => {
                        typewriter
                            .changeDelay(20)
                            .typeString('<strong><span style="color: #27ae60;">Movies And Subscription management web application </span></strong> is a M.E.R.N Stack project that simulates<br/>')
                            .typeString('an internal corporate management system for managing movie subscriptions.<br/>')
                            .pauseFor(700)
                            .typeString("The project consists of a React client and Node.js Web Services")
                            .pauseFor(700)
                            .deleteChars(12)
                            .typeString("WS ")
                            .pauseFor(500)
                            .typeString("in REST API configuration.<br/>")
                            .pauseFor(700)
                            .typeString("In fact, the client is connected to four WS, two of them are internal (self-built)<br/>")
                            .typeString("and two more are external.<br/>")
                            .pauseFor(700)
                            .typeString("The Web services using JSON files and MongoDB with the Mongoose layer as additional data sources.<br/><br/><br/>")
                            .pauseFor(700)
                            .typeString("<strong>On the client side I will demonstrate:</strong> <br/><br/>")
                            .pauseFor(700)
                            .typeString("• Using Single Page Application – in order to obtain a fast and smooth user experience similar<br/>")
                            .typeString("to an application, with this approach we can reduce the number of renderings, refreshing, and reloading of the pages<br/>")
                            .typeString("and even reduce the traffic on the server side.<br/>")
                            .pauseFor(700)
                            .typeString("• Example of Nested Routers.<br/>")
                            .pauseFor(700)
                            .typeString("• Using Context API - in order to transfer information throughout the hierarchy of components while understanding<br/>")
                            .typeString(" the \"Composition\" principle and thus avoid \"contamination\" of components that have no use for this information.<br/>")
                            .pauseFor(700)
                            .typeString("• Working with several data sources (internal/external web-services, JSON files, MongoDB) while performing complex data shaping.<br/>")
                            .pauseFor(700)
                            .typeString("• Using hooks to integrate into the life cycle of components.<br/><br/><br/>")
                            .pauseFor(700)
                            .typeString("<strong>On the server side I will demonstrate:</strong><br/><br/>")
                            .pauseFor(700)
                            .typeString("• Correct distribution of components while implementing the Micro services configuration<br/>")
                            .typeString("separation of processes using DAL components and Business Logic layers.<br/>")
                            .pauseFor(700)
                            .typeString("• Using JWT - for the purpose of securing the Routers and authenticating users, only authorized users<br/>")
                            .typeString("will be able to receive and write information to the servers. In addition, I will use the Token that<br/>")
                            .typeString("JWT created for me to configure a Session Timeout, time limit for users in the system and to prevent<br/>")
                            .typeString("a single token that leaked out to be used for unauthorized access to the servers<br/>")
                            .pauseFor(700)
                            .typeString("• Combination of Master Details with CRUD + work with JSON files + work with external Web Services.<br/>")
                            .pauseFor(180000) // wait 3 min
                            .deleteAll(1)
                            .start();
                    }}
                />
            </div>

        </div >
    );
}

export default Home_Comp;
