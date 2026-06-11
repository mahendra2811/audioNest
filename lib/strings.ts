export const strings = {
  // App
  appName: 'AudioNest',
  appTagline: 'Every audio tool. Right in your browser.',
  appSub:
    'Cut, convert, clean, and create — free, private, and 100% on your device. Nothing is ever uploaded.',

  // Trust strip
  trust: {
    free: '100% Free',
    noUpload: 'No Upload',
    noSignup: 'No Sign-up',
    mobile: 'Works on Mobile',
    private: 'Private · No Upload',
  },

  // Tool shell
  tool: {
    processing: 'Processing...',
    cancel: 'Cancel',
    download: 'Download',
    downloadAll: 'Download All',
    dropHere: 'Drop your file here',
    dropOr: 'or click to browse',
    maxSize: 'Max 500 MB · 2 hours',
    fileTooLarge: 'File too large. Max 500 MB.',
    fileTooLong: 'File too long. Max 2 hours.',
    unsupportedFormat: 'Unsupported format.',
    unsupportedBrowser: 'Please use Chrome or Safari for best compatibility.',
    tryAgain: 'Try Again',
    done: 'Done',
    addToFavourites: 'Add to favourites',
    removeFromFavourites: 'Remove from favourites',
  },

  // Errors
  errors: {
    UNSUPPORTED_BROWSER: "Your browser doesn't support this feature. Try Chrome or Safari.",
    UNSUPPORTED_FORMAT: "This file format isn't supported.",
    TOO_LARGE: 'File is too large. Maximum size is 500 MB.',
    TOO_LONG: 'File is too long. Maximum duration is 2 hours.',
    OOM: 'Not enough memory. Try a shorter clip.',
    DECODE_FAILED: "Couldn't read the audio file. It may be corrupted.",
    PROCESS_FAILED: 'Processing failed. Please try again.',
  },

  // Navigation
  nav: {
    home: 'Home',
    tools: 'Tools',
    favourites: 'Favourites',
    more: 'More',
    howItWorks: 'How it works',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms',
  },

  // Coming soon
  comingSoon: 'Coming soon',
  comingSoonToast: 'This tool is coming soon. Stay tuned!',

  // Favourites
  favouritesEmpty: 'No favourites yet. Tap ♡ on any tool to save it here.',
} as const
