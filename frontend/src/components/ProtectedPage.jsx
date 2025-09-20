'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { autenticado } from '@/lib/api';
export default function ProtectedPage({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await autenticado();

        if (data.ok) {
          console.log('Usuario autenticado, admin?', data.esAdmin);
          // Redirige solo si estás en login o registro
          const loginPages = ['/pages/login', '/pages/registro'];
          if (loginPages.includes(pathname)) {
            router.replace('/pages/home');
          }
          if(!loginPages.includes(pathname) && !data.esAdmin){
            router.replace('/pages/home');
          }
        }else{
          const accesPages = ['/pages/login', '/pages/registro', '/pages/inicio', '/pages/somos']
          if(!accesPages.includes(pathname)){
            router.replace('/pages/inicio');
          }
        }
        
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      }
    };

    checkAuth();
  }, [router, pathname]);

  return <>{children}</>;
}
