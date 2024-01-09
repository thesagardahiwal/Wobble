import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';

function Leftbar() {
  const { pathname } = useLocation();
  const {mutate: signOut, isSuccess} = useSignOutAccountMutation();
  const navigate = useNavigate();
  const {user} = useUserContext();
  useEffect(()=>{
    if (isSuccess) {
      navigate(0);
    }
  }, [isSuccess])


  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to="/" className='flex gap-3 items-center'>
          <img 
            src='/assets/images/logo.svg'
            height={200}
            width={200}
          />
        </Link>

        <Link to={`/profile/${user.id}`} className='flex gap-3 items-end'>
          <img 
            src={user.imageUrl || '/assets/images/profile.png'} alt='profile' className='h-8 w-8 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='body-bold'>
                {user.name}
              </p>
              <p className='small-regular text-light-300'>
                @{user.username}
              </p>
            </div>
        
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink)=>{
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>

              <NavLink to={link.route}
              className='flex gap-4 items-center p-4'
              >
                <img 
                  src={link.imgURL}
                  alt={link.label}
                  className={`group-hover:invert-white ${isActive && 'invert-white '}`}
                  />
                {link.label}
              </NavLink>
              </li>
            )
          })}
        </ul>

      </div>

      <div className='flex gap-4'>
        <Button variant="ghost" className='shad-button_ghost' onClick={()=> signOut()}>
          <img src='/assets/icons/logout.svg'/>
          <p className='small-medium lg:base-medium'>logout</p>
        </Button>
      </div>

    </nav>
  )
}

export default Leftbar