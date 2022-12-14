import Background from '../../Style/images/login_background.jpg';



function Home_Comp(props) {

  






    return (

        <div style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,1)),url(${Background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh',
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'
        }}>



        </div>



    );
}

export default Home_Comp;

