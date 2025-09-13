
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { UploadCloud, Loader2, Music, FileAudio, Lock, Globe } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { AuthRequired } from '@/components/auth-required';
import { useAuth } from '@/hooks/use-auth';
import { storage, db } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
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
      setAudioFile(file);
      setAudioFileName(file.name);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to upload a song.',
        variant: 'destructive',
      });
      return;
    }
     if (!coverFile || !audioFile) {
      toast({
        title: 'Missing Files',
        description: 'Please select both cover art and an audio file.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const genre = formData.get('genre') as string;
      const description = formData.get('description') as string;
      const timestamp = Date.now();

      // 1. Upload files to Firebase Storage
      const coverArtRef = ref(storage, `covers/${user.uid}/${timestamp}_${coverFile.name}`);
      await uploadBytes(coverArtRef, coverFile);
      const coverUrl = await getDownloadURL(coverArtRef);

      const audioFileRef = ref(storage, `audio/${user.uid}/${timestamp}_${audioFile.name}`);
      await uploadBytes(audioFileRef, audioFile);
      const audioUrl = await getDownloadURL(audioFileRef);

      // 2. Create song document in Firestore
      const newSongDoc = {
        title,
        artist: user.displayName || 'Anonymous',
        artistId: user.uid,
        coverUrl,
        audioUrl,
        genre,
        description,
        likes: 0,
        isPublic,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'songs'), newSongDoc);

      toast({
        title: 'Success!',
        description: `"${title}" has been uploaded.`,
      });
      
      router.push('/profile/me');

    } catch (error: any) {
       toast({
        title: 'Upload Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };


  return (
     <AuthRequired>
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
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="public-status" className="flex items-center gap-2 text-base">
                    {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    {isPublic ? 'Public' : 'Private'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isPublic
                      ? 'This song will be visible to everyone.'
                      : 'Only you can see this song.'}
                  </p>
                </div>
                <Switch
                  id="public-status"
                  name="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
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
                                  <input id="cover" name="cover" type="file" className="sr-only" accept="image/*" onChange={handleCoverChange} required/>
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
    </AuthRequired>
  );
}
