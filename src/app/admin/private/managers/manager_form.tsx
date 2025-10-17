"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { editAdminSchema } from "@/features/managers/rules";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICreateAdminInput } from "@/features/managers/type";

interface IProps {
    data: ICreateAdminInput;
    onSubmit: (data: Partial<ICreateAdminInput>) => void;
}

const EditAdminForm = ({ data, onSubmit }: IProps) => {
    const form = useForm<Partial<ICreateAdminInput>>({
        resolver: zodResolver(editAdminSchema),
        defaultValues: {
            email: data?.email || "",
            isActive: data?.isActive ?? true,
			password: ""
        },
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-5 bg-white p-6 rounded-xl shadow-md"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="admin@example.com" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password (optional)</FormLabel>
                            <FormDescription>Leave blank to keep current password.</FormDescription>
                            <FormControl>
                                <Input type="password" placeholder="***" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <FormLabel>Activate account</FormLabel>
                                <FormDescription>Toggle on/off</FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!form.formState.isValid} >
                    Add Admin
                </Button>
            </form>
        </Form>
    );
};

export default EditAdminForm;
