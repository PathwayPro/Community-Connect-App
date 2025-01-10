import { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/shared/components/ui/dialog';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '../ui/button';
import { SharedIcons } from '../icons';
import { Slider } from '../ui/slider';

interface FileEditProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string;
  onSave?: (croppedImage: string) => void;
}

export const FileEdit = ({
  open,
  onOpenChange,
  selectedImage,
  onSave
}: FileEditProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCropChange = (newCrop: Crop) => {
    const size = Math.max(newCrop.width!, newCrop.height!);
    setCrop((prev) => ({
      ...newCrop,
      width: size,
      height: size
    }));
  };

  const handleCropSizeChange = (value: number) => {
    setCrop((prev) => {
      const newSize = value;
      const centerX = prev.x! + prev.width! / 2;
      const centerY = prev.y! + prev.height! / 2;
      const newX = Math.max(0, Math.min(100 - newSize, centerX - newSize / 2));
      const newY = Math.max(0, Math.min(100 - newSize, centerY - newSize / 2));

      return {
        ...prev,
        width: newSize,
        height: newSize,
        x: newX,
        y: newY
      };
    });
  };

  const handleSave = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width! * scaleX;
    canvas.height = crop.height! * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x! * scaleX,
      crop.y! * scaleY,
      crop.width! * scaleX,
      crop.height! * scaleY,
      0,
      0,
      crop.width! * scaleX,
      crop.height! * scaleY
    );

    const croppedImage = canvas.toDataURL('image/jpeg');
    onSave?.(croppedImage);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeButton={false}
        className="min-h-[788px] min-w-[680px] rounded-2xl text-center"
      >
        <DialogTitle>
          <div className="flex items-center justify-between">
            <h4>Crop Photo</h4>
            <Button
              variant="ghost"
              size="icon"
              className="p-0"
              onClick={() => onOpenChange(false)}
            >
              <SharedIcons.x className="h-6 w-6" />
            </Button>
          </div>
          <Separator className="mt-2" />
        </DialogTitle>
        <div className="flex items-center justify-center rounded-lg bg-primary-5 p-6">
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            aspect={1}
            className="max-h-[500px] max-w-[500px]"
          >
            <img
              ref={imageRef}
              src={selectedImage ?? ''}
              alt="Selected"
              className="w-auto object-contain"
            />
          </ReactCrop>
        </div>
        <div className="flex items-center space-x-4 p-6">
          <SharedIcons.image className="h-6 w-6" />
          <Slider
            className="w-full"
            defaultValue={[50]}
            min={20}
            max={95}
            step={1}
            value={[crop.width!]}
            onValueChange={(value) => handleCropSizeChange(value[0])}
          />
          <SharedIcons.image className="h-10 w-10" />
        </div>
        <Separator className="mb-4" />
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            className="w-[180px]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="w-[180px]" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
