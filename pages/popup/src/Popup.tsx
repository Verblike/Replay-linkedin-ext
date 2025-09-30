import { db } from './firebase';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { cn } from '@extension/ui';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const AUTH_URL = 'https://your-auth-website.com'; // TODO: Replace with your actual auth URL

interface Highlight {
  text: string;
  timestamp: number;
  email: string;
  postUrl?: string;
  id?: string;
}

const Popup = () => {
  const { email, uid, isLight } = useStorage(exampleThemeStorage);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uid) {
      setLoading(true);
      const fetchHighlights = async () => {
        const highlightsRef = collection(db, 'users', uid, 'highlights');
        const snapshot = await getDocs(highlightsRef);
        const data: Highlight[] = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Highlight);
        setHighlights(data);
        setLoading(false);
      };
      fetchHighlights();
    } else {
      setHighlights([]);
    }
  }, [uid]);

  const goAuthorize = () => window.open(AUTH_URL, '_blank');

  if (!email || !uid) {
    return (
      <div>
        <div>You have to authorize first.</div>
        <button
          className={cn(
            'mt-4 rounded px-4 py-1 font-bold shadow hover:scale-105',
            isLight ? 'bg-blue-500 text-white' : 'bg-blue-700 text-white',
          )}
          onClick={goAuthorize}>
          Authorize
        </button>
      </div>
    );
  }

  return (
    <div className={cn('App min-h-screen p-4', isLight ? 'bg-slate-50' : 'bg-gray-800')}>
      <header className={cn('App-header mb-4', isLight ? 'text-gray-900' : 'text-gray-100')}>
        <div className="mb-2">
          Email: <b>{email}</b>
        </div>
        {loading ? (
          <div className="animate-pulse text-blue-500">Loading highlights...</div>
        ) : highlights.length > 0 ? (
          <div>
            <h2 className="mb-2 text-lg font-semibold">Your Highlights</h2>
            <ul className="space-y-4">
              {highlights.map(h => (
                <li
                  key={h.id}
                  className={cn(
                    'rounded-lg p-4 shadow transition hover:scale-[1.02]',
                    isLight ? 'bg-white' : 'bg-gray-700',
                  )}>
                  <div className="mb-1">
                    <b>Text:</b> <span className="break-words">{h.text}</span>
                  </div>
                  <div className="mb-1">
                    <b>Timestamp:</b> {new Date(h.timestamp).toLocaleString()}
                  </div>
                  {h.postUrl && (
                    <div className="mb-1">
                      <b>Post URL:</b>{' '}
                      <a
                        href={h.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800">
                        {h.postUrl}
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-gray-500">No highlights found.</div>
        )}
      </header>
    </div>
  );
};

export default Popup;
