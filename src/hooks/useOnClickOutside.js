import { useEffect } from 'react';

export const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Nếu không có ref hoặc click vào bên trong ref -> Không làm gì
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      // Click ra ngoài -> Gọi hàm handler
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};