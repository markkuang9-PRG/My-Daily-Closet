import { Loader2, LogIn, Shirt } from 'lucide-react';

type AuthScreenProps = {
  isLoggingIn: boolean;
  onLogin: () => void;
};

export const AuthScreen = ({ isLoggingIn, onLogin }: AuthScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-md bg-white h-screen flex flex-col items-center justify-center p-8 shadow-2xl">
        <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <Shirt className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-2">My Daily Closet</h1>
        <p className="text-gray-500 text-center mb-10">
          Your Smart Wardrobe Manager
          <br />
          Turn piled-up clothes into liquid assets
        </p>
        <button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full bg-black text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-600"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Opening login window...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" /> Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};
