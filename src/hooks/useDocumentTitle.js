import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title; // Lưu lại tiêu đề cũ
    document.title = title; // Đổi sang tiêu đề mới

    // Khi thoát trang thì trả lại tiêu đề cũ (hoặc giữ nguyên tùy ý, thường thì không cần dòng này cũng được)
    // return () => {
    //   document.title = prevTitle;
    // };
  }, [title]);
};

export default useDocumentTitle;