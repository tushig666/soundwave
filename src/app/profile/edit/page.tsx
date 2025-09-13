
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, User, Edit, ArrowLeft, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthRequired } from '@/components/auth-required';
import { useAuth } from '@/hooks/use-auth';
import { storage, auth } from '@/lib/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { AppLayout } from '@/components/layout/app-layout';

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoURL || null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Not Authenticated',
        description: 'You must be logged in to edit your profile.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      let photoURL = user.photoURL;

      // 1. If a new photo is selected, upload it to Firebase Storage
      if (photoFile) {
        const photoRef = ref(storage, `profile-pictures/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // 2. Update user profile in Firebase Auth
      await updateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL,
      });

      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
      
      // Force a reload of the user object in the auth context
      await auth.currentUser?.reload(); 
      router.push('/profile/me');

    } catch (error: any) {
       toast({
        title: 'Update Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
     <AuthRequired>
        <AppLayout>
            <div className="p-4 md:p-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Profile
                </Button>
                <div className="mb-6 flex items-center gap-4">
                <Edit className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Edit Your Profile</h1>
                </div>

                <Card className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        Update your display name and profile picture.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                        id="displayName" 
                        name="displayName" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name" 
                        required 
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="mt-2 flex items-center gap-x-3">
                            {photoPreview ? (
                                <Image src={photoPreview} alt="Profile preview" width={96} height={96} className="h-24 w-24 rounded-full object-cover" />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                                    <User className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                            <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80">
                                <Camera className="mr-2 h-4 w-4 inline"/>
                                <span>Change</span>
                                <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                    </div>
                    </CardContent>
                    <CardFooter>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Save Changes
                    </Button>
                    </CardFooter>
                </form>
                </Card>
            </div>
        </AppLayout>
    </AuthRequired>
  );
}
