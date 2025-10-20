"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash } from 'lucide-react'
import React, { ChangeEvent } from 'react' 

const defaultProperties = {
    name: '',
    color: '', 
    size: '', 
    price: 0
}

type IProperties = typeof defaultProperties

interface IProps {
    value: {
        name: string;
        color?: string;
        size?: string;
        price: number;
    }[],
    onChange: (value: {
        name: string;
        color?: string;
        size?: string;
        price: number;
    }[]) => void
}

const PropertiesField = ({ value = [], onChange }: IProps) => {


    const onAddProperty = () => {
        onChange([...value, { ...defaultProperties }])
    }

    const onRemoveProperty = (index: number) => {
        onChange(value.filter((_, idx) => idx !== index))
    }

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value: inputValue, type } = e.target;
        const newValue = type === 'number' ? Number(inputValue) : inputValue;
        const newProperties = value.map((item, idx) => {
            if (idx === index) {
                return {
                    ...item,
                    [name]: newValue 
                }
            }
            return item;
        });
        onChange(newProperties);
    }

    return (
        <div className='flex gap-3 flex-col'>
            {
                value.map(({ name, color, size, price }, index) => (
                    <div className='flex gap-3' key={index}>
                        <Input
                            placeholder='name'
                            name='name'
                            value={name}
                            onChange={(e) => onChangeValue(e, index)} />
                        <Input
                            placeholder='color'
                            name='color'
                            value={color}
                            onChange={(e) => onChangeValue(e, index)} />
                        <Input
                            placeholder='size'
                            name='size'
                            value={size}
                            onChange={(e) => onChangeValue(e, index)} />
                        <Input
                            placeholder='price, ex: 10.000 VND'
                            name='price'
                            type='number'
                            value={price}
                            onChange={(e) => onChangeValue(e, index)} />
                        <Button variant='outline' size='icon' type='button' onClick={() => onRemoveProperty(index)}>
                            <Trash className='w-4 h-4' />
                        </Button>
                    </div>
                ))
            }

            <Button variant='outline' size='icon' type='button' onClick={onAddProperty}>
                <Plus />
            </Button>
        </div>
    )
}

export default PropertiesField