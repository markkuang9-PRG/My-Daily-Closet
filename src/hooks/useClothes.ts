import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { logAppError } from '../lib/logger';
import type { ClothingItem } from '../types';

export const useClothes = (user: User | null, isAuthReady: boolean) => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);

  useEffect(() => {
    if (!user || !isAuthReady) {
      setClothes([]);
      return;
    }

    const path = `/users/${user.uid}/clothes`;
    const clothesQuery = query(collection(db, 'users', user.uid, 'clothes'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      clothesQuery,
      (snapshot) => {
        const items: ClothingItem[] = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as ClothingItem);
        });
        setClothes(items);
      },
      (error) => {
        logAppError(error, {
          operation: 'firestore_sync',
          path,
          userId: user.uid,
        });
      },
    );

    return () => unsubscribe();
  }, [isAuthReady, user]);

  return clothes;
};
