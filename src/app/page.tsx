import { BallPit } from './ui/BallSimulation/BallPit';

export default function Home() {
    const useBrowserWindow = true;
    const padding = useBrowserWindow ? '' : 'md:p-20 p-3';

    return (
        <div className={`w-full h-full relative flex items-center justify-center ${padding}`}>
            <BallPit />
        </div>
    );
}
