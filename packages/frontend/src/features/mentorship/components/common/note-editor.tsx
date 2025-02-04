'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import {
  ToggleGroup,
  ToggleGroupItem
} from '@/shared/components/ui/toggle-group';
import { Bold, Italic, Underline, Link, PlusCircle, Type } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import React from 'react';

interface NoteEditorProps {
  onSubmit: (note: { title: string; content: string }) => void;
}

export function NoteEditor({ onSubmit }: NoteEditorProps) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [textSize, setTextSize] = React.useState<string>('normal');
  const [formats, setFormats] = React.useState<string[]>([]);

  const getTextStyles = () => {
    const styles = ['font-normal']; // default styles

    if (formats.includes('bold')) styles.push('font-bold');
    if (formats.includes('italic')) styles.push('italic');
    if (formats.includes('underline')) styles.push('underline');

    switch (textSize) {
      case 'small':
        styles.push('text-sm');
        break;
      case 'large':
        styles.push('text-lg');
        break;
      default:
        styles.push('text-base');
    }

    return styles.join(' ');
  };

  const handleSubmit = () => {
    onSubmit({ title, content });
  };

  return (
    <div className="h-full w-full space-y-4 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ToggleGroup
            type="multiple"
            className="flex items-center space-x-1"
            value={formats}
            onValueChange={setFormats}
          >
            <Select value={textSize} onValueChange={setTextSize}>
              <SelectTrigger className="w-[100px]">
                <Type className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="link" aria-label="Add link">
              <Link className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Button className="h-10" onClick={handleSubmit}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <Input
          placeholder="Note Title"
          className={`text-lg font-semibold ${getTextStyles()}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Write your note here..."
          className={`min-h-[220px] w-full resize-none rounded-xl border border-input bg-background p-2 focus:outline-none focus:ring-2 focus:ring-ring ${getTextStyles()}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}
