import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleSubscribe = () => {
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="w-full flex justify-center mt-20 py-10">
      <div className="w-[90%] max-w-6xl">
        <div className="relative overflow-hidden  rounded-3xl p-12 md:p-16 shadow-2xl">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-black">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Subscribe To Our Newsletter
                </h2>
              </div>
              <p className="text-lg text-black/90 leading-relaxed">
                Get exclusive deals, new product updates, and insider tips
                delivered straight to your inbox.
              </p>
            </div>

            {/* Right Side - Subscription Input */}
            <div className="flex-1 w-full md:max-w-md">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-14 rounded-xl px-5 pr-32 border-2 border-black/30 bg-white/10 backdrop-blur-md text-black placeholder-white/60 focus:outline-none focus:border-white/60 transition-all"
                  />
                  <button
                    onClick={handleSubscribe}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={isSubscribed}
                    className="absolute right-2 top-2 bg-white text-indigo-600 h-10 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Subscribed!
                      </>
                    ) : (
                      <>
                        Subscribe
                        <Send className={`w-4 h-4 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-black/70 leading-relaxed">
                  By subscribing, you agree to our{' '}
                  <span className="underline hover:text-black transition-colors cursor-pointer">
                    Privacy Policy
                  </span>{' '}
                  and consent to receive updates
                </p>
              </div>

              {/* Success Message */}
              {isSubscribed && (
                <div className="mt-4 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-lg p-3 text-black text-sm animate-pulse">
                  ✨ Welcome aboard! Check your inbox for confirmation.
                </div>
              )}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-4 -right-4 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;