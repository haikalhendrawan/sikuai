import {Button, Card, Image, CardFooter} from "@nextui-org/react";


interface GeneratorCard{
  onOpenChange: () => void,
  title: string,
  imageUrl: string
};

export default function GeneratorCard({onOpenChange, title, imageUrl}: GeneratorCard) {
  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none"
    >
      <Image
        alt={title}
        className="object-cover"
        height={300}
        src={imageUrl}
        width={250}
      />
      <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="text-tiny text-black/80">
          {title}
        </p>
        <Button 
          className="text-tiny text-white bg-black transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-100 duration-100 ml-1" 
          variant="flat" 
          color="default" 
          radius="lg" 
          size="sm"
          onClick={onOpenChange}
        >
          Buat
        </Button>
      </CardFooter>
    </Card>
  ) 
}