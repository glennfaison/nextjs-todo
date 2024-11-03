import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Task Manager
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/" className="hover:text-gray-300">
              Task Board
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}