// file: EditFormManager.tsx
"use client";

import React from 'react';
import { toast } from 'sonner';
import { onEditManager } from './actions';
import { ICreateAdminInput } from '@/features/managers/type';
import FormManager from '../../manager_form';
import { useRouter } from 'next/navigation';

interface IProps {
    data: ICreateAdminInput;
    id: string;
}

const EditFormManager = ({ data, id }: IProps) => {
    const router = useRouter();

    const onSubmit = async (formData: ICreateAdminInput) => {
        // Gọi action và hứng kết quả trả về vào biến `result`
        const result = await onEditManager(id, formData);

        // Dùng `if` để kiểm tra kết quả và hiển thị toast tương ứng
        if (result.success) {
            // Nếu kết quả là `success: true`, hiển thị toast thành công
            toast.info('Add manager successfully !');

            // Sau khi toast hiện ra, bạn có thể chuyển trang
            router.push('/admin/managers'); 
        } else {
            // Nếu kết quả là `success: false`, hiển thị toast lỗi
            toast.error(result.error || 'An error occurred.!');
        }
    };

    return (
        <div>
            <h2 className='text-lg font-bold mb-8'>Edit Manager</h2>
            <FormManager onSubmit={onSubmit} data={data} />
        </div>
    );
};

export default EditFormManager;