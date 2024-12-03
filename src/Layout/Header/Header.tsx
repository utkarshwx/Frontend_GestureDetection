import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <header className="flex justify-between items-center px-8 py-4">
        <Link to="/" className="text-2xl font-bold">
          GestureAI
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="#features" className="text-sm font-medium text-gray-300 hover:text-white">
            FEATURES
          </Link>
          <Link to="#contact" className="text-sm font-medium text-gray-300 hover:text-white">
            CONTACT
          </Link>          
        </nav>
      </header>
    </div>
  )
}

export default Header
