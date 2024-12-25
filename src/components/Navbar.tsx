
import ToggleMode from './ToggleMode'

const Navbar = () => {
    return (
        <div className='flex items-start justify-between bg-pink-700 p-4'>
            <h1 className=' sm:text-2xl text-xl font-bold text-center text-white '>Valampuri Bharatgas</h1>
            <ToggleMode />
        </div>
    )
}

export default Navbar
