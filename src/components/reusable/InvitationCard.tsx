import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BsThreeDots } from 'react-icons/bs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@/components/ui/model';
import { Button } from '../ui/button';
import { CornerDownLeft} from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const InvitationCard: React.FC = () => {
  const [model, setModel] = useState<boolean>(false);
  return (
    <>
      <Modal open={model} onOpenChange={setModel}>
        <ModalContent
          onInteractOutside={(e) => e.preventDefault()}
          className="min-w-[50%] p-0 gap-0"
        >
          <ModalHeader className="p-0 h-[50px] shadow border-b px-[20px] justify-center m-0">
            <div className="flex items-center gap-[5px]">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <CardTitle className="text-slate-600">John Doe</CardTitle>
            </div>
          </ModalHeader>
          <div className="h-[calc(100vh-300px)]  bg-neutral-100">
            <div className='h-[calc(100vh-400px)] overflow-y-auto px-[20px] py-[10px]'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia perferendis odit quisquam modi. Repellendus a iste error quis fuga enim corporis accusantium aliquid fugiat, aperiam perspiciatis nostrum quasi omnis rem cupiditate maxime consequatur doloremque. Totam ipsam a rem necessitatibus amet eius minima exercitationem laboriosam tempora rerum ipsum explicabo ratione reiciendis repudiandae aliquam aspernatur illo culpa, quidem porro expedita. Nulla minus porro eaque in eius fugit, cupiditate sequi accusamus tempora itaque, facere doloremque sapiente veniam aut, natus dolorem? Minus nisi, nobis distinctio, temporibus sit itaque impedit recusandae explicabo soluta amet, omnis pariatur ut odit? Amet esse voluptas sit et reprehenderit laborum, pariatur praesentium eaque commodi aperiam reiciendis ullam omnis nemo repudiandae quasi eligendi illum ipsum voluptatum id rem neque beatae? Eveniet sequi earum neque, modi ut ipsam incidunt soluta, quaerat aperiam cupiditate temporibus animi tenetur perferendis minima enim non veniam. Rem aut porro dolor atque quaerat, natus modi dolores maiores eum labore cumque similique unde harum distinctio autem neque veniam ut dignissimos excepturi debitis ex numquam. Id modi, dicta quos amet eveniet velit optio similique. Vero quaerat veniam esse officia rerum quae vel labore excepturi cumque, suscipit ratione, similique hic voluptas? Impedit, odit. Amet, nam cupiditate? Adipisci modi, ipsam possimus doloribus labore maiores perferendis, voluptatem incidunt asperiores sequi quasi error voluptatum minus eius! Suscipit, quaerat. Non, ducimus architecto voluptatum repellendus, suscipit corrupti aliquid unde officiis ut maiores quibusdam fugiat qui. Ipsa quae, voluptate vero earum, sequi harum soluta veritatis aperiam qui molestias tempore sunt exercitationem sed repellat reprehenderit iusto, hic illo sint perspiciatis perferendis nobis a assumenda id minima! Eligendi alias sint rerum deserunt dolores aliquid beatae. Voluptatibus temporibus laudantium quidem ad tempora illum aspernatur. Natus placeat sunt, doloribus in cum nam esse optio debitis iusto perspiciatis maiores quaerat, inventore atque. Consectetur neque cum dolorem inventore illum iure repudiandae sunt dolores.
            </div>
            <form className="relative overflow-hidden border rounded-none bg-white h-[100px] ">
              <Label htmlFor="message" className="sr-only">
                message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="p-3 border-0 shadow-none resize-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-teal-500 hover:bg-teal-600 px-[20px]">
                  Reply
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
          <ModalFooter className="h-[50px] border-t  items-center px-[20px] m-0">
            <Button variant={'outline'} onClick={() => setModel(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Card className="p-0 border-l-8 rounded-sm shadow-md border-l-green-500 shadow-neutral-400">
        <CardContent className="flex p-[10px] gap-[10px]">
          <div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex gap-[5px]">
                <CardTitle className="text-slate-600">John Doe</CardTitle>
                <span className="text-[13px] text-slate-500">1 hour ago</span>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-0 bg-transparent text-[25px] shadow-none text-slate-400 hover:bg-transparent">
                    <BsThreeDots />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="shadow-neutral-400"
                  >
                    <DropdownMenuItem onClick={() => setModel(true)}>
                      Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>Mark as read</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardDescription className="mt-[5px] text-[13px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              dolore consequatur nostrum quas...
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InvitationCard;
