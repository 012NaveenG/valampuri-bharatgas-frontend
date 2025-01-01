
import { useNavigate } from 'react-router-dom'
import ToggleMode from './ToggleMode'
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

const Navbar = () => {
const navigate =useNavigate()

    const handleLogout = () => {

        localStorage.removeItem('signedIn')
        navigate('/')
        

    }
    return (
        <div className='flex items-start justify-between bg-pink-700 p-4'>
            <h1 className=' sm:text-2xl text-xl font-bold text-center text-white '>Valampuri Bharatgas</h1>
            <div className='flex items-center space-x-4'>
                <Button onClick={handleLogout} variant={"ghost"}><LogOut /></Button>
                <ToggleMode/>
            </div>
        </div>
    )
}

export default Navbar
