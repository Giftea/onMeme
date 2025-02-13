"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc.utils";
import { UserSchema, UserSchemaType } from "@/lib/zod-schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function EditUsernameModal({ userName }: { userName: string }) {
  const trpcUtils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const defaultValues = { username: userName };
  const form = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const { mutateAsync: handleUpdateUser, isPending } =
    trpc.user.updateUser.useMutation({
      onSuccess: () => {
        trpcUtils.user.fetchUser.invalidate();
        setOpen(false);
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const handleOnSubmit = async (_data: UserSchemaType) => {
    await handleUpdateUser({
      username: _data.username,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name={"username"}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center ">
                    <FormLabel htmlFor="username" className="text-base">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="username"
                        required
                        className="col-span-3"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button disabled={isPending} type="submit">
                {isPending ? <Loader /> : "Save"}{" "}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
