'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UploadCloud, Loader2, Music, FileAudio } from 'lucide-react';
import Image from 'next/image';

export default function UploadPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFileName(file.name);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    // Mock upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUploading(false);
    // Here you would handle the actual upload logic
    alert('Song submitted for review!');
  };


  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-4">
        <UploadCloud className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Upload Your Music</h1>
      </div>
      <p className="mb-8 max-w-2xl text-muted-foreground">
        Share your sound with the world. Fill out the form below to upload your track.
      </p>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Track Details</CardTitle>
          <CardDescription>
            Provide information about your song.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Song Title</Label>
              <Input id="title" name="title" placeholder="e.g., My Awesome Track" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" name="genre" placeholder="e.g., Pop, Rock, Lofi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us a little about your song."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Art</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-gray-100/25">
                    <div className="text-center">
                        {coverPreview ? (
                           <Image src={coverPreview} alt="Cover preview" width={128} height={128} className="mx-auto h-32 w-32 object-cover rounded-md" />
                        ) : (
                            <Music className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                            <label
                                htmlFor="cover"
                                className="relative cursor-pointer rounded-md bg-white dark:bg-gray-900 font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 hover:text-primary-dark"
                            >
                                <span>Upload a file</span>
                                <input id="cover" name="cover" type="file" className="sr-only" accept="image/*" onChange={handleCoverChange} required />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio">Audio File</Label>
                 <div className="mt-2 flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-gray-100/25">
                    {audioFileName ? (
                      <div className="text-center">
                        <FileAudio className="mx-auto h-12 w-12 text-primary" />
                        <p className="mt-4 text-sm font-medium text-foreground">{audioFileName}</p>
                         <label
                              htmlFor="audio"
                              className="relative mt-2 cursor-pointer text-xs text-primary hover:underline"
                            >
                              <span>Change file</span>
                              <input id="audio" name="audio" type="file" className="sr-only" accept="audio/*" onChange={handleAudioChange} />
                            </label>
                      </div>
                    ) : (
                      <div className="text-center">
                          <Music className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                              <label
                                  htmlFor="audio"
                                  className="relative cursor-pointer rounded-md bg-white dark:bg-gray-900 font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 hover:text-primary-dark"
                              >
                                  <span>Upload a file</span>
                                  <input id="audio" name="audio" type="file" className="sr-only" accept="audio/*" onChange={handleAudioChange} required />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600 dark:text-gray-500">MP3, WAV, FLAC up to 20MB</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Upload Song
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
