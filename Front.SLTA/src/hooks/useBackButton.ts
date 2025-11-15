import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

/**
 * Hook personalizado para manejar el botón back de Android en tabs.
 * Previene que el botón back navegue hacia atrás cuando estás en las páginas principales de tabs.
 */
export const useBackButton = () => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Lista de rutas principales de tabs donde NO queremos navegación back
    const tabRoutes = [
      '/articulos',
      '/dealers',
      '/publicar',
      '/guardado',
      '/perfil'
    ];

    let listenerHandle: any;

    const setupListener = async () => {
      listenerHandle = await App.addListener('backButton', ({ canGoBack }) => {
        const currentPath = location.pathname;

        // Si estamos en una ruta principal de tab
        if (tabRoutes.includes(currentPath)) {
          // Si estamos en Artículos (primera página), salir de la app
          if (currentPath === '/articulos') {
            App.exitApp();
          } else {
            // Si estamos en otro tab, ir a Artículos
            history.push('/articulos');
          }
        } else if (canGoBack) {
          // Para páginas de detalle u otras páginas, permitir navegación normal
          history.goBack();
        } else {
          // Si no se puede ir atrás, salir de la app
          App.exitApp();
        }
      });
    };

    setupListener();

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [history, location.pathname]);
};
