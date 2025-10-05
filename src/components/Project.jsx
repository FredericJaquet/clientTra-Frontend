import '../assets/css/App.css';
import Navbar from "./Navbar";
import demoVideo from "../assets/videos/ClientTra_Frontend.mp4";

function Project() {

    return (
        <div className="min-h-screen flex flex-col">
            <div className="justify-items-start">
                <Navbar/>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto">
                <div className="min-h-screen flex items-center justify-center w-full">
                    <div className="relative w-2/3 aspect-square bg-[color:var(--primary)] rounded-full flex items-center justify-center">
                        <video 
                            src={demoVideo}
                            controls 
                            className="w-3/4 object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;