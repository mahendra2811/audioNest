export interface FAQ {
  question: string
  answer: string
}

export const toolFaqs: Record<string, FAQ[]> = {
  'audio-cutter': [
    {
      question: 'What is an audio cutter and what can I do with it?',
      answer:
        'An audio cutter is a tool that trims or clips a portion of an audio file. You can cut out the first 30 seconds of a song to make a ringtone, remove a silent intro, extract a specific segment, or shorten a recording for social media.',
    },
    {
      question: 'How do I cut an MP3 file online for free?',
      answer:
        'Open AudioNest Audio Cutter, drop your MP3 file onto the page, set the start and end times using the sliders, then click Process. Your trimmed MP3 downloads immediately. No software to install, no account required.',
    },
    {
      question: 'Can I cut audio without losing quality?',
      answer:
        'Yes. AudioNest uses FFmpeg for audio cutting, which performs a sample-accurate cut without re-encoding the entire file. For MP3, the tool re-encodes to preserve the exact trim points — at 320 kbps the quality difference is inaudible.',
    },
    {
      question: 'What audio formats does the audio cutter support?',
      answer:
        'AudioNest Audio Cutter supports MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, and WMA files as input. Output is delivered as MP3.',
    },
    {
      question: 'Is it safe to use an online audio cutter? Will my files be uploaded?',
      answer:
        'AudioNest runs entirely in your browser — your audio file never leaves your device. FFmpeg processes the audio using WebAssembly technology directly in the browser, so there is no server upload, no storage of your files, and no privacy risk.',
    },
    {
      question: 'How do I make a ringtone from a song using audio cutter?',
      answer:
        'Drop your song into AudioNest Audio Cutter, set the start and end times to select your favorite 20–30 second section (usually the chorus), enable Fade Out for a smooth ending, then click Process. Download the trimmed MP3 and transfer it to your phone.',
    },
    {
      question: 'Can I add fade in and fade out when cutting audio?',
      answer:
        'Yes. AudioNest Audio Cutter has toggle options for Fade In and Fade Out. Enabling Fade Out applies a gradual volume reduction at the end of the trimmed clip, which prevents an abrupt stop — especially useful for ringtones and background music clips.',
    },
    {
      question: 'What is the maximum file size I can cut?',
      answer:
        'Because processing happens in your browser, the practical limit depends on your device\'s available RAM. Files up to 500 MB work well on most modern computers. Very large files (1 GB+) may be slow to process.',
    },
    {
      question: 'How precise is the audio cutter — can I cut to the exact millisecond?',
      answer:
        'AudioNest Audio Cutter lets you type exact timestamps with second-level precision. For sub-second accuracy, you can type values like 1:23.5 (1 minute 23.5 seconds). The actual cut accuracy depends on the source format — WAV allows sample-accurate cuts.',
    },
    {
      question: 'Can I cut multiple files at once?',
      answer:
        'AudioNest Audio Cutter processes one file at a time for precise control over each trim. For batch cutting multiple files, process them one by one. If you need to split a file into multiple parts, use the Audio Splitter tool instead.',
    },
  ],

  'audio-joiner': [
    {
      question: 'How do I combine multiple audio files into one?',
      answer:
        'Open AudioNest Audio Joiner, drop all the audio files you want to combine, arrange them in the correct order, set a crossfade duration if you want smooth transitions, then click Process. The combined file downloads as a single MP3.',
    },
    {
      question: 'Can I join audio files of different formats?',
      answer:
        'Yes. AudioNest Audio Joiner accepts MP3, WAV, FLAC, OGG, AAC, and M4A files simultaneously. It converts them to a common format during processing and outputs a single combined MP3.',
    },
    {
      question: 'What is crossfade and should I use it when joining audio?',
      answer:
        'Crossfade blends the end of one audio file into the beginning of the next, creating a smooth transition instead of an abrupt cut. Use it for music playlists (2–3 seconds) to avoid jarring jumps between songs. For podcasts and lectures, use no crossfade (0 seconds) for clean chapter transitions.',
    },
    {
      question: 'Is there a limit to how many files I can join?',
      answer:
        'There is no hard limit on the number of files. Practically, very large joins (many long files) may take some time to process in the browser. For a standard podcast or playlist join of 5–15 files, processing is fast.',
    },
    {
      question: 'Can I reorder the audio files before joining?',
      answer:
        'Yes. Once you add files to AudioNest Audio Joiner, you can drag them to reorder them before processing. The files play back in the order you set.',
    },
    {
      question: 'Will joining audio files affect the quality?',
      answer:
        'Joining requires encoding the output as MP3. The output quality is set at a high bitrate to minimize quality loss. Starting from lossless sources (WAV or FLAC) will produce better results than starting from low-bitrate MP3s.',
    },
    {
      question: 'How do I merge podcast episodes into one file?',
      answer:
        'Add all your podcast segments to AudioNest Audio Joiner in episode order. Set crossfade to 0 for clean cuts between segments. Click Process and download your combined episode file. This works well for multi-part recordings that need to be published as a single episode.',
    },
    {
      question: 'Can I join audio with different sample rates?',
      answer:
        'Yes. AudioNest Audio Joiner handles sample rate differences automatically, converting all files to a common sample rate during the join process.',
    },
  ],

  'audio-splitter': [
    {
      question: 'How do I split a large audio file into smaller parts?',
      answer:
        'Open AudioNest Audio Splitter, drop your audio file, choose whether to split by equal time intervals (e.g., every 10 minutes) or by a specific number of equal parts, set your preference, and click Process. Download a ZIP file containing all the split segments.',
    },
    {
      question: 'Can I split an MP3 without re-encoding it?',
      answer:
        'AudioNest Audio Splitter uses FFmpeg for processing. The output is encoded as MP3 at a high bitrate. The split is accurate to the second.',
    },
    {
      question: 'What formats does the audio splitter support?',
      answer:
        'Input formats include MP3, WAV, FLAC, OGG, AAC, and M4A. All segments are output as MP3.',
    },
    {
      question: 'How do I split a podcast into chapters?',
      answer:
        'For precise chapter splits at specific timestamps, use AudioNest Audio Cutter to extract each chapter individually — set the exact start and end time for each segment. For equal-length chapter splits, Audio Splitter with a time interval is faster.',
    },
    {
      question: 'What file size limit applies to the audio splitter?',
      answer:
        'Processing happens entirely in your browser. Files up to 500 MB work well on most computers. Very large files may be slow to process depending on your available RAM.',
    },
    {
      question: 'Can I split a file into a specific number of pieces?',
      answer:
        'Yes. Choose "equal parts" mode and enter the number of segments. AudioNest will divide the total duration equally and create that many output files.',
    },
    {
      question: 'How do I split an audiobook into chapters?',
      answer:
        'If you know the chapter timestamps, use AudioNest Audio Cutter for each chapter. If you want equal splits, use Audio Splitter with a time interval that matches your typical chapter length (often 15–30 minutes for audiobooks).',
    },
    {
      question: 'Will the split files have the same quality as the original?',
      answer:
        'The split files are re-encoded as MP3 at a high bitrate. Starting from a high-quality source (320 kbps MP3 or WAV) will produce the best results. The quality reduction from one round of re-encoding is minimal at high bitrates.',
    },
  ],

  'audio-reverser': [
    {
      question: 'How do I reverse an audio file online?',
      answer:
        'Open AudioNest Audio Reverser, drop your audio file, click Process, and download the reversed version. The reversal is instant for most files.',
    },
    {
      question: 'What is reversed audio used for?',
      answer:
        'Reversed audio is used in music production for reverse cymbal effects, ambient pad creation, and sound design. It\'s also used for novelty (hearing a song backwards), vocal practice (hearing your own timing mistakes), and as a creative compositional tool.',
    },
    {
      question: 'What does audio reversal sound like?',
      answer:
        'Reversed audio plays all audio samples in the opposite order. Attack transients (the sharp beginning of sounds) become decays, and decays become attacks. Speech sounds alien and unrecognizable. Music creates a dreamlike, ambient texture.',
    },
    {
      question: 'Can I reverse only part of an audio file?',
      answer:
        'AudioNest Audio Reverser reverses the entire file. To reverse only a segment, first use Audio Cutter to extract that segment, reverse it with Audio Reverser, then join the reversed segment back with Audio Joiner.',
    },
    {
      question: 'What formats does the audio reverser support?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is reversed audio a common music production technique?',
      answer:
        'Yes. Reverse reverb, reverse cymbal, and reversed piano are all classic production techniques used across electronic music, pop, rock, and film scoring. Reversing a sound creates a "swell" effect — volume building into a hit rather than decaying after.',
    },
    {
      question: 'Does reversing audio affect the file quality?',
      answer:
        'Reversing re-encodes the audio to MP3. The reversal itself doesn\'t reduce quality, but re-encoding introduces a small quality reduction. Start from a high-quality source (WAV or high-bitrate MP3) for best results.',
    },
    {
      question: 'Are there any hidden backwards messages in music?',
      answer:
        'The practice of embedding intentional backwards messages is called backmasking. While a cultural curiosity, most claimed backmasked messages are pareidolia — hearing patterns in random sounds. AudioNest Audio Reverser lets you check for yourself.',
    },
  ],

  'speed-changer': [
    {
      question: 'How do I change the speed of audio without changing the pitch?',
      answer:
        'Open AudioNest Speed Changer, drop your audio file, set the speed multiplier (0.5x for half speed, 2x for double speed), and click Process. The tool uses time-stretching algorithms to change tempo while preserving the original pitch.',
    },
    {
      question: 'What is the difference between speed and pitch in audio?',
      answer:
        'Speed is how fast the audio plays back (tempo). Pitch is how high or low the sounds are. They are linked in natural playback — faster means higher pitch. Time-stretching separates them, allowing speed changes without pitch changes.',
    },
    {
      question: 'Can I slow down a song to learn it on guitar or piano?',
      answer:
        'Yes. Set the speed to 0.65x or 0.75x to slow the music to practice speed. The pitch stays the same so notes are in the correct positions. Practice at slow speed, then gradually increase back to 1.0x as you improve.',
    },
    {
      question: 'What speed settings are available?',
      answer:
        'AudioNest Speed Changer supports speeds from 0.5x (half speed) to 2.0x (double speed). Common useful settings: 0.75x (25% slower), 1.25x (25% faster), 1.5x (50% faster), 2.0x (double speed).',
    },
    {
      question: 'Will the audio quality change after speed adjustment?',
      answer:
        'Time-stretching does introduce some processing artifacts, especially at extreme speeds (below 0.6x or above 1.8x). For small speed changes (0.8x–1.5x), the quality is excellent. Start from a high-bitrate source for best results.',
    },
    {
      question: 'Can I speed up a podcast to save listening time?',
      answer:
        'Yes. At 1.5x speed, a 60-minute podcast takes 40 minutes. At 2.0x, it takes 30 minutes. Speech remains intelligible up to about 1.75x for most speakers. Use AudioNest Speed Changer to create your preferred playback speed version.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is speed change the same as pitch shift?',
      answer:
        'No. Speed change (time-stretching) changes tempo while keeping pitch constant. Pitch shift changes the pitch while keeping tempo constant. AudioNest offers both as separate tools: Speed Changer and Pitch Shifter.',
    },
  ],

  'audio-converter': [
    {
      question: 'How do I convert an audio file to MP3 online?',
      answer:
        'Open AudioNest Audio Converter, drop your audio file (WAV, FLAC, OGG, AAC, M4A, OPUS, or WMA), select MP3 as the output format, choose your desired bitrate, and click Process. Your converted MP3 downloads instantly.',
    },
    {
      question: 'What audio formats can I convert between?',
      answer:
        'AudioNest Audio Converter supports conversion between: MP3, WAV, OGG, FLAC, AAC, M4A, and OPUS. You can convert from any supported format to any other supported format.',
    },
    {
      question: 'What bitrate should I choose when converting to MP3?',
      answer:
        'For music: 256–320 kbps for high quality, 192 kbps for a good balance, 128 kbps for smaller files. For voice/podcasts: 128 kbps is standard. For voice-only content where size matters: 96 kbps is acceptable.',
    },
    {
      question: 'Can I convert FLAC to MP3 without losing quality?',
      answer:
        'Converting FLAC to MP3 always involves some quality loss because MP3 is a lossy format. However, at 256–320 kbps, the quality difference is inaudible to most people in most listening environments. FLAC is lossless; MP3 removes some audio data during compression.',
    },
    {
      question: 'Can I convert MP3 to FLAC to improve quality?',
      answer:
        'No. Converting a lossy format (MP3) to a lossless format (FLAC) does not recover the lost audio data. The resulting FLAC file will be larger but sound identical to the MP3. You cannot "upgrade" quality through conversion.',
    },
    {
      question: 'Is audio conversion free and private?',
      answer:
        'Yes. AudioNest Audio Converter runs entirely in your browser. Your files are never uploaded to a server. The conversion happens locally using FFmpeg WebAssembly.',
    },
    {
      question: 'How long does audio conversion take?',
      answer:
        'Conversion speed depends on your file size, device speed, and target format. A typical 4-minute MP3 converts in under 10 seconds. Larger files (WAV, FLAC) may take 30–60 seconds.',
    },
    {
      question: 'Why convert audio to WAV?',
      answer:
        'WAV is the standard lossless audio format required by many video editors (Final Cut Pro, Premiere Pro) and DAWs. Converting to WAV ensures no additional quality loss when editing. WAV files are larger but universally compatible.',
    },
  ],

  'video-to-audio': [
    {
      question: 'How do I extract audio from a video file?',
      answer:
        'Open AudioNest Video to Audio, drop your video file (MP4, MOV, MKV, AVI, or WebM), choose the output format (MP3, WAV, or FLAC), and click Process. The audio track is extracted and downloaded.',
    },
    {
      question: 'What video formats can I extract audio from?',
      answer:
        'AudioNest Video to Audio supports MP4, MOV, MKV, AVI, and WebM video files as input.',
    },
    {
      question: 'Can I convert an MP4 to MP3 online for free?',
      answer:
        'Yes. Drop your MP4 file into AudioNest Video to Audio, select MP3 as the output, and process. The audio track is extracted as an MP3 file. This is the fastest free way to convert MP4 to MP3 without software.',
    },
    {
      question: 'Will extracting audio from a video reduce the quality?',
      answer:
        'The audio quality is limited by the video\'s original audio track quality. If the video has a 128 kbps AAC audio track, the extracted MP3 will be limited to that quality. A high-quality video with a 320 kbps audio track will produce a high-quality extraction.',
    },
    {
      question: 'Is it legal to extract audio from a YouTube video?',
      answer:
        'Extracting audio from YouTube videos without permission violates YouTube\'s Terms of Service for copyrighted content. Legal uses include: your own uploaded videos, Creative Commons licensed videos, public domain recordings, and content you have explicit rights to use.',
    },
    {
      question: 'Can I extract audio from a video recorded on my phone?',
      answer:
        'Yes. Video files from iPhone (MOV, MP4), Android (MP4), and any other device are supported. Drop the video file into AudioNest Video to Audio and extract the audio track.',
    },
    {
      question: 'Does my video file get uploaded to a server?',
      answer:
        'No. AudioNest runs entirely in your browser. Video files are processed locally using FFmpeg WebAssembly. Nothing is uploaded to any server.',
    },
    {
      question: 'What if I want FLAC instead of MP3 from the video?',
      answer:
        'Select FLAC as the output format before processing. FLAC is lossless, so the output quality is the best possible extraction from the video\'s audio track. The resulting file will be larger than an MP3.',
    },
  ],

  'photo-audio-to-video': [
    {
      question: 'How do I create a video from a photo and audio file?',
      answer:
        'Open AudioNest Photo Audio to Video, drop your image (JPG, PNG, or WebP) and your audio file (MP3, WAV, FLAC, etc.), then click Process. The tool creates an MP4 video where the image is displayed for the entire duration of the audio.',
    },
    {
      question: 'What image formats are supported?',
      answer:
        'AudioNest Photo Audio to Video accepts JPG, PNG, and WebP images. For best video quality, use an image at least 1280×720 pixels. 1920×1080 (1080p) is ideal for YouTube.',
    },
    {
      question: 'Why do I need to combine a photo with audio to make a video?',
      answer:
        'YouTube and most video platforms do not accept audio-only uploads. To post a podcast episode, music track, or lecture on YouTube, you need a video container. Combining your audio with a static image (like album artwork or a podcast logo) creates a valid video file.',
    },
    {
      question: 'What is the output video format?',
      answer:
        'AudioNest creates an MP4 file. This is the most widely supported video format and is accepted by YouTube, Vimeo, Instagram, TikTok, and all major platforms.',
    },
    {
      question: 'Will the video be 4K, 1080p, or another resolution?',
      answer:
        'The output video resolution matches your input image. If you use a 1920×1080 image, you get a 1080p video. If you use a 1280×720 image, you get a 720p video.',
    },
    {
      question: 'Is my image and audio file uploaded to a server?',
      answer:
        'No. AudioNest operates entirely in your browser. Both your image and audio file are processed locally. Nothing is uploaded or stored.',
    },
    {
      question: 'Can I use this to upload podcast episodes to YouTube?',
      answer:
        'Yes — this is one of the most common use cases. Use your podcast episode\'s cover art as the image and your episode audio file. The resulting MP4 uploads directly to YouTube as a podcast-to-video video.',
    },
    {
      question: 'How long can the audio file be?',
      answer:
        'There is no enforced duration limit, but very long audio files (1+ hour) may take a few minutes to process in the browser. For a standard podcast episode (30–90 minutes), processing completes in under 2 minutes on most computers.',
    },
  ],

  'audio-compressor': [
    {
      question: 'How do I reduce the file size of an audio file?',
      answer:
        'Open AudioNest Audio Compressor, drop your audio file, select a lower bitrate (e.g., 128 kbps for speech, 192 kbps for music), and click Process. The output MP3 file is significantly smaller than the original.',
    },
    {
      question: 'What is the difference between audio compression and audio file compression?',
      answer:
        'Audio file compression reduces the file size by encoding audio at a lower bitrate (lossy) or using algorithms like FLAC (lossless). Dynamic range compression in music production is a different concept — it reduces the difference between loud and quiet parts of a recording.',
    },
    {
      question: 'What bitrate should I use for compressed audio?',
      answer:
        '64 kbps: Voice-only, acceptable quality. 96 kbps: Voice and simple audio. 128 kbps: General music and podcasts — good default. 192 kbps: Music, noticeably better. 256 kbps: High quality music. 320 kbps: Maximum MP3 quality.',
    },
    {
      question: 'How much can I reduce an audio file size?',
      answer:
        'Converting a CD-quality WAV (1411 kbps) to 128 kbps MP3 reduces file size by about 91%. A 100 MB WAV becomes about 9 MB. A 50 MB FLAC file might become 4–5 MB as a 128 kbps MP3.',
    },
    {
      question: 'Will compressing audio make it sound worse?',
      answer:
        'Lossy compression (converting to low-bitrate MP3) does reduce quality. At 128 kbps most people cannot hear the difference for speech. At 256+ kbps, music quality is excellent and most listeners cannot distinguish from the original.',
    },
    {
      question: 'What audio formats does the compressor accept?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3 at your chosen bitrate.',
    },
    {
      question: 'Is audio compression free and private?',
      answer:
        'Yes. AudioNest Audio Compressor is completely free and runs in your browser. Your audio file is never uploaded to any server.',
    },
    {
      question: 'What are the best settings for podcast audio compression?',
      answer:
        '128 kbps, mono, 44100 Hz sample rate. This is the industry standard for podcast audio. It balances file size and audio quality for speech content, and all podcast platforms and apps support these settings.',
    },
  ],

  'noise-remover': [
    {
      question: 'How do I remove background noise from an audio recording?',
      answer:
        'Open AudioNest Noise Remover, drop your audio file, adjust the noise reduction strength if needed, and click Process. The tool identifies and reduces consistent background noise like HVAC hum, fan noise, and electrical hiss.',
    },
    {
      question: 'What types of noise can be removed?',
      answer:
        'AudioNest Noise Remover works best on consistent, steady-state noise: air conditioning hum, electrical hiss, fan noise, computer fan noise, and microphone self-noise (static). It works less well on intermittent noise like traffic, coughing, or speech.',
    },
    {
      question: 'Will noise removal affect the quality of my voice recording?',
      answer:
        'Aggressive noise reduction can introduce audio artifacts — a "watery" or "warbling" sound on voices. Start with a low to medium reduction setting, preview the result, and only increase if needed. Subtle noise reduction is usually better than heavy processing.',
    },
    {
      question: 'Can noise removal fix clipping or distortion?',
      answer:
        'No. Clipping (recording too loud, causing distortion) is not fixable through noise removal. Clipping permanently damages the audio signal. The only fix is to re-record at a lower gain level.',
    },
    {
      question: 'What formats does the noise remover support?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is my recording uploaded to a server for noise removal?',
      answer:
        'No. AudioNest Noise Remover runs entirely in your browser. Your recording is processed locally — nothing is uploaded.',
    },
    {
      question: 'How do I reduce HVAC noise in a home recording?',
      answer:
        'Drop your recording into AudioNest Noise Remover and set a medium noise reduction level. HVAC noise is consistent (same frequency, same level throughout) which makes it ideal for spectral subtraction. The tool identifies the noise profile and subtracts it from the signal.',
    },
    {
      question: "Can I remove noise from a video recording's audio?",
      answer:
        'First, extract the audio from the video using AudioNest Video to Audio. Then remove noise with AudioNest Noise Remover. Finally, you can recombine the cleaned audio with the video in a video editor.',
    },
  ],

  'silence-remover': [
    {
      question: 'How do I remove silence from an audio recording?',
      answer:
        'Open AudioNest Silence Remover, drop your audio file, set the silence threshold (how quiet counts as silence) and minimum silence duration, then click Process. All gaps quieter than the threshold for longer than the minimum duration are automatically removed.',
    },
    {
      question: 'What is a silence threshold in audio?',
      answer:
        'The silence threshold is the dB level below which audio is considered silence. -40 dB is good for quiet recordings. -50 dB for recordings with background noise. Anything quieter than the threshold for longer than your minimum duration will be removed.',
    },
    {
      question: 'Will the silence remover cut off words or speech?',
      answer:
        'With properly set minimum silence duration (0.5–1.0 second), the tool only removes genuine pauses. Set padding to 0.1–0.2 seconds to keep a small buffer around detected speech, preventing word clipping.',
    },
    {
      question: 'Can silence remover help with podcast editing?',
      answer:
        'Yes. Silence Remover automates the removal of dead air, awkward pauses, and "um" gaps (when they\'re silent). It can reduce a 60-minute interview by 8–15% of listening time, saving manual editing work.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is silence removal the same as noise removal?',
      answer:
        'No. Silence removal cuts out segments that fall below a volume threshold — actual quiet gaps. Noise removal reduces background noise that exists throughout the recording, even when someone is speaking.',
    },
    {
      question: 'Will removing silence change the timing of my recording?',
      answer:
        'Yes — that is the point. Removing silence makes the recording shorter and tighter. The total duration decreases, but all speech content remains intact.',
    },
    {
      question: 'Can I use silence remover on music?',
      answer:
        'Yes, but carefully. Music often has intentional quiet passages. Use a very low threshold (-50 dB or lower) and a longer minimum duration (2+ seconds) to only remove true silence at the start or end, not during the track.',
    },
  ],

  'volume-booster': [
    {
      question: 'How do I make audio louder online?',
      answer:
        'Open AudioNest Volume Booster, drop your audio file, set the dB gain amount (+3 dB to +20 dB), and click Process. Your boosted audio file downloads ready to use.',
    },
    {
      question: 'What is dB gain and how much should I apply?',
      answer:
        '+3 dB: Noticeably louder (doubles perceived power). +6 dB: Significantly louder. +10 dB: Very loud. Only apply what is needed — excessive gain causes clipping and distortion. If a recording is only slightly quiet, +3–6 dB is usually enough.',
    },
    {
      question: 'What is the difference between Volume Booster and Audio Normalizer?',
      answer:
        'Volume Booster applies a fixed gain increase to the entire file. Audio Normalizer measures the loudest peak in the file and adjusts to bring it to a target level (0 dBFS or -1 dBFS). Use Normalizer first; use Booster if you need additional volume on top of a normalized file.',
    },
    {
      question: 'Can boosting volume cause distortion?',
      answer:
        'Yes — boosting too much causes clipping, where audio peaks exceed 0 dBFS and become distorted. AudioNest Volume Booster applies a limiter to prevent hard clipping, but very large boosts (+15 dB or more) on already-loud files can still cause audible saturation.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is the volume booster free?',
      answer:
        'Yes, completely free. AudioNest Volume Booster runs in your browser with no registration, no account, and no upload to any server.',
    },
    {
      question: 'Can I boost the volume of a video\'s audio track?',
      answer:
        'Extract the audio from the video using AudioNest Video to Audio, boost it with Volume Booster, then recombine in a video editor. AudioNest Photo Audio to Video can also be used to create a new video with the boosted audio and original thumbnail.',
    },
    {
      question: 'Why does my recording sound quiet even after boosting?',
      answer:
        'If background noise is also being boosted, the recording may seem quiet relative to the noise floor. Try using Noise Remover first to reduce background noise, then boost volume. Also check that the recording isn\'t clipping — if it is, boosting makes the distortion worse.',
    },
  ],

  'audio-normalizer': [
    {
      question: 'What does audio normalization do?',
      answer:
        'Normalization adjusts the overall volume of an audio file so the loudest peak or integrated loudness reaches a specific target level. The entire file is raised or lowered by the same amount to achieve consistent volume.',
    },
    {
      question: 'How do I normalize audio online?',
      answer:
        'Open AudioNest Audio Normalizer, drop your audio file, choose your target level (0 dBFS for peak normalization or -14/-16 LUFS for loudness normalization), and click Process. The normalized file downloads ready to use.',
    },
    {
      question: 'What is LUFS and why does it matter for streaming?',
      answer:
        'LUFS (Loudness Units relative to Full Scale) measures perceived loudness over time. Streaming platforms use LUFS to normalize all content to consistent levels: Spotify and YouTube use -14 LUFS; Apple Podcasts recommends -16 LUFS. Targeting the right LUFS ensures your content sounds comparable in volume to everything else on the platform.',
    },
    {
      question: 'What LUFS level should I target for podcasts?',
      answer:
        '-16 LUFS integrated loudness is the recommended standard for podcasts. This is compatible with Apple Podcasts guidelines and falls within the range Spotify uses. Some podcasters target -14 LUFS to match Spotify\'s normalization more closely.',
    },
    {
      question: 'What is the difference between peak normalization and loudness normalization?',
      answer:
        'Peak normalization adjusts so the loudest sample hits the target (e.g., 0 dBFS or -1 dBFS). Loudness normalization (LUFS) adjusts for perceived loudness over time, which is more accurate for how listeners experience volume.',
    },
    {
      question: 'What formats does the normalizer support?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Can normalization damage audio quality?',
      answer:
        'Peak normalization is a simple gain adjustment — it doesn\'t damage quality. Loudness normalization may require more significant gain changes; starting from a lossless source (WAV or FLAC) before normalizing and converting gives the best results.',
    },
    {
      question: 'Do I need to normalize audio before uploading to YouTube?',
      answer:
        'YouTube automatically applies loudness normalization to all uploaded audio/video content, targeting -14 LUFS. However, manually normalizing to -14 LUFS before upload ensures your content sounds as intended without relying on YouTube\'s automatic processing.',
    },
  ],

  'bass-booster': [
    {
      question: 'How do I boost bass in audio online?',
      answer:
        'Open AudioNest Bass Booster, drop your audio file, set the boost level (start at +3 to +6 dB), click Process, and preview the result. If it sounds muddy, reduce the setting. Download when you\'re happy.',
    },
    {
      question: 'What frequency range does bass boosting affect?',
      answer:
        'Bass frequencies generally cover 20–250 Hz. Sub-bass (20–60 Hz) is felt more than heard. Bass (60–200 Hz) is where kick drums and bass guitars live. AudioNest Bass Booster targets the 60–150 Hz range for the most musical bass enhancement.',
    },
    {
      question: 'Can boosting bass cause distortion?',
      answer:
        'Yes. Too much bass boost saturates low frequencies and causes muddy, distorted sound. Start with a modest +3 dB boost. Increase gradually. If it sounds muddy, you\'ve gone too far.',
    },
    {
      question: 'Will bass boosting improve music on small speakers?',
      answer:
        'Paradoxically, aggressive bass boosting can make music sound worse on small speakers that can\'t reproduce deep bass. The bass boost creates distortion in the speaker driver without adding audible bass. Moderate boosts (+3–5 dB) targeting 100–200 Hz (which small speakers can reproduce) are more effective.',
    },
    {
      question: 'What formats does the bass booster support?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is bass boosting the same as equalization (EQ)?',
      answer:
        'Yes — bass boosting is a specific type of EQ: applying gain to low frequencies. A full EQ lets you boost or cut any frequency range. The Bass Booster is a simplified version focused on low-end enhancement.',
    },
    {
      question: 'Can I boost bass in a podcast or voice recording?',
      answer:
        'Yes. Voice recordings can benefit from a moderate bass boost (+2–4 dB around 150–200 Hz) to add warmth. Avoid boosting very low frequencies (below 80 Hz) in voice recordings as these are typically room rumble, not voice content.',
    },
    {
      question: 'What is the best bass setting for hip-hop music?',
      answer:
        'Hip-hop typically benefits from heavy sub-bass enhancement (+6–10 dB below 80 Hz) for the 808 kick and bass sounds, combined with a mid cut around 200–300 Hz to keep it clean. Start with +6 dB and adjust by ear.',
    },
  ],

  'pitch-shifter': [
    {
      question: 'How do I change the pitch of audio without changing speed?',
      answer:
        'Open AudioNest Pitch Shifter, drop your audio file, enter the number of semitones to shift (positive = higher, negative = lower), and click Process. The pitch changes while the duration stays the same.',
    },
    {
      question: 'What is a semitone in music?',
      answer:
        'A semitone is the smallest interval in Western music — one step on a piano keyboard. There are 12 semitones in an octave. Shifting +12 semitones raises pitch by one octave (doubles the frequency). Shifting -12 semitones lowers pitch by one octave (halves the frequency).',
    },
    {
      question: 'Can I transpose a song to a different key for singing practice?',
      answer:
        'Yes. Drop the song into AudioNest Pitch Shifter and enter the number of semitones needed. If a song is in C and you want it in A (a minor third lower), shift by -3 semitones. If you want it in Eb (a minor third higher), shift by +3 semitones.',
    },
    {
      question: 'What is the quality like after pitch shifting?',
      answer:
        'Small shifts (±1–3 semitones) sound natural and high quality. Larger shifts (±6+ semitones) introduce time-stretching artifacts. Extreme shifts (±12 semitones) may sound mechanical or robotic. Starting from a lossless source (WAV or FLAC) gives the best results.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Is pitch shifting the same as changing speed?',
      answer:
        'No. Speed change (time-stretching) alters tempo while keeping pitch constant. Pitch shifting changes pitch while keeping tempo constant. AudioNest offers both as separate tools.',
    },
    {
      question: 'Can I use pitch shifter to create harmonies?',
      answer:
        'Yes. Export multiple copies of a vocal recording at different pitch shifts (+3 semitones for a minor third up, +7 for a fifth, +12 for an octave) and mix them in a DAW to create harmony layers.',
    },
    {
      question: 'How many semitones can I shift?',
      answer:
        'AudioNest Pitch Shifter supports a range of -12 to +12 semitones (one octave in either direction). Most useful pitch shifts are within ±5 semitones for natural-sounding results.',
    },
  ],

  'reverb-adder': [
    {
      question: 'How do I add reverb to audio online?',
      answer:
        'Open AudioNest Reverb Adder, drop your audio file, choose the reverb type (room, hall, plate, or cathedral), set the decay time and wet/dry mix, click Process, and download.',
    },
    {
      question: 'What is reverb and how does it affect audio?',
      answer:
        'Reverb is the acoustic effect of sound reflecting off surfaces in a space. In audio production, adding reverb makes a recording sound like it was performed in a physical environment — from a small intimate room to a vast cathedral.',
    },
    {
      question: 'What is wet/dry mix in reverb?',
      answer:
        'The dry signal is the original audio. The wet signal is the reverb effect. Wet/dry mix determines the balance: 100% dry = no reverb; 100% wet = only reverb, no original. For subtle room presence, 20–30% wet. For dramatic effect, 60–80% wet.',
    },
    {
      question: 'What reverb type should I use for vocals?',
      answer:
        'Room or plate reverb is the most natural-sounding for vocals. Room at 30% wet adds subtle presence. Hall reverb at 20–40% wet creates a lush, concert-feel. Cathedral reverb is too large for most vocal applications.',
    },
    {
      question: 'Can reverb make a dry home recording sound professional?',
      answer:
        'Reverb can add space and dimension to a dry recording. However, adding reverb does not fix fundamental recording problems like clipping, excessive noise, or poor microphone placement. Fix those first, then add reverb as a finishing touch.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'How is reverb decay time measured?',
      answer:
        'Reverb decay time (RT60) is measured in seconds — the time for the reverb tail to decrease by 60 dB. 0.3–0.5 seconds: small room. 0.8–1.5 seconds: studio or chamber. 2–4 seconds: concert hall. 6–10 seconds: cathedral.',
    },
    {
      question: 'Is reverb the same as echo?',
      answer:
        'Echo is a distinct, repeated playback of sound (like shouting in a canyon). Reverb is the blending of many fast reflections that merge into a smooth decay. Most music production uses reverb, not echo. Echo (or delay) is a separate effect.',
    },
  ],

  'stereo-to-mono': [
    {
      question: 'How do I convert stereo audio to mono?',
      answer:
        'Open AudioNest Stereo to Mono, drop your stereo audio file, click Convert, and download the mono output. The two stereo channels are mixed together into a single mono signal.',
    },
    {
      question: 'Why would I want mono audio instead of stereo?',
      answer:
        'Mono is preferred for podcasts and voice content (half the file size, identical quality for speech), for phone speaker playback (most phones have one primary speaker), for PA systems (stereo can cause phase issues), and for recordings that were made with a single microphone (already mono information).',
    },
    {
      question: 'Will converting stereo to mono cause phase cancellation?',
      answer:
        'If the stereo recording has intentional out-of-phase elements (a stereo width effect technique), summing to mono can cause those elements to cancel out and become quieter or disappear. For standard music and speech, mono conversion is transparent.',
    },
    {
      question: 'What happens to hard-panned elements when converting to mono?',
      answer:
        'A sound panned hard-left in stereo will be 3–6 dB quieter in the mono mix compared to a center-panned sound. This is expected behavior — both channels are averaged, so exclusive left-channel content appears at half power.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'What is the file size difference between stereo and mono?',
      answer:
        'A mono MP3 file is approximately 50% the size of the equivalent stereo file at the same bitrate. Converting stereo podcast audio to mono cuts file size roughly in half.',
    },
    {
      question: 'Is stereo to mono conversion free?',
      answer:
        'Yes. AudioNest Stereo to Mono is completely free, runs in your browser, and never uploads your files.',
    },
    {
      question: 'Does converting to mono affect the loudness?',
      answer:
        'When two channels are summed to mono, the combined level can be up to +3 dB louder than either individual channel. AudioNest handles this with appropriate gain correction to prevent clipping.',
    },
  ],

  'mono-to-stereo': [
    {
      question: 'How do I convert mono audio to stereo?',
      answer:
        'Open AudioNest Mono to Stereo, drop your mono audio file, click Convert, and download the stereo output. The single mono channel is duplicated to create both left and right channels.',
    },
    {
      question: 'Why would I convert mono audio to stereo?',
      answer:
        'Some software, platforms, or systems require stereo files even for mono content. Converting mono to stereo creates a compatible file without changing the audio content.',
    },
    {
      question: 'Does mono-to-stereo create a "real" stereo effect?',
      answer:
        'No. Mono-to-stereo conversion duplicates the mono channel to L and R — both channels are identical. It sounds the same as the mono original. True stereo requires different content in L and R channels, which requires stereo recording or psychoacoustic processing.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'What is the file size difference?',
      answer:
        'A stereo file is approximately 2x the size of the equivalent mono file. Converting mono to stereo roughly doubles the file size.',
    },
    {
      question: 'Will this fix audio that only plays in one ear?',
      answer:
        'If your audio plays only in the left ear because it\'s a mono file assigned only to the left channel (a common video editing routing issue), converting to dual-mono stereo with AudioNest Mono to Stereo fixes this. If the problem is a damaged audio file or hardware issue, this tool won\'t help.',
    },
    {
      question: 'Is mono to stereo conversion free?',
      answer:
        'Yes. Completely free, browser-based, no uploads.',
    },
    {
      question: 'I recorded a podcast in mono but my video editor requires stereo — what should I do?',
      answer:
        'Use AudioNest Mono to Stereo to convert your mono recording to a stereo file (dual-mono — same signal in both channels). Import this stereo file into your video editor. It will play correctly through both channels in the final video.',
    },
  ],

  'bpm-detector': [
    {
      question: 'How do I find the BPM of a song?',
      answer:
        'Open AudioNest BPM Detector, drop your audio file, and the tool analyzes the audio to detect the tempo. The BPM is displayed along with a confidence score.',
    },
    {
      question: 'What is BPM in music?',
      answer:
        'BPM stands for Beats Per Minute — the tempo of music. 60 BPM = one beat per second. 120 BPM = two beats per second. Most dance music is 120–140 BPM. Classical music varies widely.',
    },
    {
      question: 'How accurate is the BPM detector?',
      answer:
        'For music with a clear, consistent percussion pattern (kick drum, claps), accuracy is typically ±1 BPM. For complex music without clear beat patterns (classical, ambient, jazz with complex rhythms), accuracy varies. The confidence score indicates reliability.',
    },
    {
      question: 'Why does the detected BPM seem doubled or halved?',
      answer:
        'BPM detectors sometimes detect the subdivision instead of the main beat. If a track at 70 BPM shows as 140 BPM, the detector found the eighth-note subdivisions. The solution: the correct BPM is either what was displayed or half of it.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: displays the BPM reading (no audio file output).',
    },
    {
      question: 'Can I use this to find BPM for DJ mixing?',
      answer:
        'Yes. BPM Detector gives you the precise tempo of both tracks you want to mix. Once you have matching BPMs (or know the ratio), you can beatmatch them in your DJ software.',
    },
    {
      question: 'What BPM is good for running?',
      answer:
        'Running cadence for most runners is 160–180 steps per minute. Music at 160–180 BPM naturally encourages a matching pace. For a moderate jog, 140–160 BPM works. For warm-up and cool-down, 100–120 BPM.',
    },
    {
      question: 'Can I detect BPM from a voice recording or spoken word?',
      answer:
        'The BPM detector needs rhythmic patterns (percussion, claps, steady beats) to work accurately. Speech and spoken word without a musical backing track will not produce an accurate BPM reading.',
    },
  ],

  'loudness-meter': [
    {
      question: 'How do I measure the loudness of an audio file?',
      answer:
        'Open AudioNest Loudness Meter, drop your audio file, and view the integrated LUFS, true peak, and LRA (loudness range) values. No processing is applied — this is a read-only analysis tool.',
    },
    {
      question: 'What is the difference between LUFS, RMS, and peak level?',
      answer:
        'Peak level: the highest instantaneous sample value. RMS: average power over time, a rough loudness measure. LUFS (Integrated): perceived loudness over the full file duration, accounting for psychoacoustic weighting. LUFS is the most accurate for streaming compatibility.',
    },
    {
      question: 'What LUFS level should my music be for Spotify?',
      answer:
        'Spotify normalizes all tracks to -14 LUFS. If your track is louder than -14 LUFS, Spotify turns it down. If quieter, it plays back softer than surrounding content. Mastering to -14 LUFS integrated gives the most consistent Spotify experience.',
    },
    {
      question: 'What is True Peak and why does it matter?',
      answer:
        'True Peak measures the peak level including inter-sample peaks — peaks that occur between digitally sampled points and can cause distortion in playback decoders. For streaming, true peak should not exceed -1 dBTP. -1 dBTP is the industry standard.',
    },
    {
      question: 'What formats does the loudness meter support?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, and video formats (MP4, MOV, MKV). Output: loudness readings displayed on screen.',
    },
    {
      question: 'What LUFS level should my podcast be?',
      answer:
        '-16 LUFS integrated is the recommended standard for podcasts. This fits within Apple Podcasts\' recommended range and is close enough to Spotify\'s -14 LUFS target that automatic normalization won\'t dramatically change your episode\'s perceived volume.',
    },
    {
      question: 'What is LRA (Loudness Range)?',
      answer:
        'LRA measures the dynamic range of the audio — the statistical spread between quiet and loud parts. A high LRA (20+ LU) indicates very dynamic content. A low LRA (2–4 LU) indicates heavily compressed/limited content. Pop music typically targets 6–9 LU. Classical: 12–20 LU.',
    },
    {
      question: 'Is my audio file uploaded when using the loudness meter?',
      answer:
        'No. AudioNest Loudness Meter analyzes audio entirely in your browser using WebAssembly. Nothing is uploaded or transmitted.',
    },
  ],

  'id3-tag-editor': [
    {
      question: 'How do I edit MP3 tags online?',
      answer:
        'Open AudioNest ID3 Tag Editor, drop your MP3 file, edit any fields (title, artist, album, year, genre, track number, comment), upload album art if needed, click Save, and download the updated MP3 with your new tags embedded.',
    },
    {
      question: 'What are ID3 tags?',
      answer:
        'ID3 tags are metadata stored inside an MP3 file. They tell music players the track title, artist name, album, year, genre, track number, and can include embedded cover art. Without them, music players show "Unknown Artist" and "Track 01."',
    },
    {
      question: 'Can I add album art to an MP3 file?',
      answer:
        'Yes. AudioNest ID3 Tag Editor lets you upload a JPG or PNG image to embed as cover art. Use a square image (1:1 aspect ratio) at 500×500 or 1000×1000 pixels for best compatibility across players.',
    },
    {
      question: 'What ID3 tag fields can I edit?',
      answer:
        'Title, Artist, Album, Album Artist, Year, Track Number, Genre, Comment, and Cover Art.',
    },
    {
      question: 'Does editing ID3 tags change the audio quality?',
      answer:
        'No. ID3 tags are metadata attached to the file. Editing them does not affect the audio data in any way. The audio quality remains identical after tagging.',
    },
    {
      question: 'What file formats does the ID3 tag editor support?',
      answer:
        'AudioNest ID3 Tag Editor is designed for MP3 files. ID3 tags are specific to the MP3 format.',
    },
    {
      question: 'Is my MP3 file uploaded to a server when editing tags?',
      answer:
        'No. AudioNest processes everything in your browser. Your MP3 file never leaves your device.',
    },
    {
      question: 'Can I edit tags on multiple MP3 files at once?',
      answer:
        'AudioNest ID3 Tag Editor processes one file at a time for precise control over each track\'s metadata. Process files individually for accuracy.',
    },
  ],

  'metadata-remover': [
    {
      question: 'How do I remove metadata from an audio file?',
      answer:
        'Open AudioNest Metadata Remover, drop your audio file, click Remove Metadata, and download the cleaned file. All embedded technical metadata including GPS coordinates, device info, and recording timestamps are stripped.',
    },
    {
      question: 'What metadata can audio files contain?',
      answer:
        'Audio files — especially those recorded on phones — can contain GPS coordinates, device model and OS version, recording app name, timestamp of recording, and timezone information. Some formats also include software history and user notes.',
    },
    {
      question: 'Why should I remove metadata from audio files?',
      answer:
        'Privacy: GPS metadata in a recording you share publicly can reveal your location. Security: device information can be used in fingerprinting. Professionalism: selling sample packs or beat stems without your device\'s metadata embedded.',
    },
    {
      question: 'Will removing metadata affect audio quality?',
      answer:
        'No. Metadata is separate from the audio data. Removing metadata does not affect the audio signal, quality, or playback in any way.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Does metadata removal also remove ID3 music tags (title, artist, album)?',
      answer:
        'AudioNest Metadata Remover focuses on technical metadata (GPS, device info, timestamps). You can choose whether to preserve music ID3 tags (title, artist, album) or strip everything. Check the tool options before processing.',
    },
    {
      question: 'Is my audio file uploaded when using metadata remover?',
      answer:
        'No. AudioNest runs entirely in your browser. Your file is processed locally with no upload.',
    },
    {
      question: 'Can I check what metadata is in a file before removing it?',
      answer:
        'Use AudioNest Audio Info first to inspect the file\'s metadata. Audio Info shows all embedded fields without modifying the file. Then use Metadata Remover to strip what you don\'t want.',
    },
  ],

  'loop-maker': [
    {
      question: 'How do I create an audio loop?',
      answer:
        'Open AudioNest Loop Maker, drop your audio clip, set the number of repeats (2–50), optionally set a gap between repetitions, click Process, and download the looped file.',
    },
    {
      question: 'What is an audio loop?',
      answer:
        'An audio loop is a segment of audio repeated seamlessly in sequence. Loops are fundamental to music production (drum loops, melody loops), background music creation (a 30-second clip repeated for 1 hour), and practice (repeating a scale or exercise).',
    },
    {
      question: 'How do I make my audio loop seamlessly?',
      answer:
        'For a truly seamless loop, the audio clip must start and end cleanly — no fade-in at the start, no fade-out at the end. Use AudioNest Audio Cutter first to trim your clip to a precise loop point. The end of the clip should flow naturally into the beginning.',
    },
    {
      question: 'What formats are supported?',
      answer:
        'Input: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Output: MP3.',
    },
    {
      question: 'Can I add a gap between each loop repetition?',
      answer:
        'Yes. AudioNest Loop Maker lets you set a gap (in seconds) between each repetition. This is useful for practice loops where you want time to rest, or for sound effects that need breathing room.',
    },
    {
      question: 'How do I create 1 hour of background music from a short clip?',
      answer:
        'Calculate repeats needed: 3600 seconds ÷ clip duration in seconds. For a 60-second clip, you need 60 repeats for 1 hour. Set that number in Loop Maker and process.',
    },
    {
      question: 'Is there a maximum number of loops?',
      answer:
        'AudioNest Loop Maker supports up to 50 repetitions in the tool. For more repeats, process twice — create a 50-loop file, then loop that file again.',
    },
    {
      question: 'Can I use Loop Maker for music production samples?',
      answer:
        'Yes. Drop an 8-bar drum loop, set it to repeat 8 times to get a 64-bar drum track, then import the exported MP3 into your DAW as the drum bed for a session.',
    },
  ],

  'audio-info': [
    {
      question: 'How do I check the details of an audio file?',
      answer:
        'Open AudioNest Audio Info, drop your audio or video file, and view the complete technical profile: format, codec, bitrate, sample rate, channels, duration, file size, and embedded ID3 tags.',
    },
    {
      question: 'What information does Audio Info display?',
      answer:
        'Format (MP3, WAV, FLAC, etc.), codec (MPEG Audio Layer 3, AAC-LC, etc.), bitrate (kbps), sample rate (Hz), number of channels (mono/stereo), duration, file size, and ID3 tags (title, artist, album, year, genre, embedded cover art).',
    },
    {
      question: 'How can I check if a FLAC file is truly lossless?',
      answer:
        'Drop the FLAC file into AudioNest Audio Info. If the codec shows "FLAC" and there\'s no history of prior MP3 encoding, it\'s likely genuine lossless. However, a FLAC file that was converted from MP3 will still show as FLAC — use a spectrum analyzer to check for the high-frequency rolloff characteristic of MP3 encoding.',
    },
    {
      question: 'Does Audio Info modify my file?',
      answer:
        'No. Audio Info is a read-only analysis tool. It does not modify, convert, or process your audio file in any way.',
    },
    {
      question: 'What formats does Audio Info support?',
      answer:
        'Audio: MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA. Video (audio track analysis): MP4, MOV, MKV, AVI, WebM.',
    },
    {
      question: 'Can I see the cover art embedded in an MP3?',
      answer:
        'Yes. If an MP3 has cover art embedded in its ID3 tags, AudioNest Audio Info displays a preview of it alongside the other metadata.',
    },
    {
      question: 'Is my file uploaded to a server for analysis?',
      answer:
        'No. All analysis happens in your browser using FFmpeg WebAssembly. Your file never leaves your device.',
    },
    {
      question: 'Why is the bitrate of my MP3 different from what I expected?',
      answer:
        'MP3 files can use Constant Bitrate (CBR) or Variable Bitrate (VBR). A VBR file might show an average bitrate different from the "maximum" bitrate used during encoding. Audio Info shows the actual measured bitrate of the file.',
    },
  ],
}

export const homeFaqs: FAQ[] = [
  {
    question: 'What is AudioNest?',
    answer:
      'AudioNest is a free, browser-based collection of 24 audio tools. You can cut, convert, compress, clean, and analyze audio files directly in your browser — no software to download, no account to create, and no files uploaded to any server.',
  },
  {
    question: 'Are all AudioNest tools really free?',
    answer:
      'Yes. All 24 tools on AudioNest are completely free to use with no limits. There are no premium plans, no watermarks, and no trial periods.',
  },
  {
    question: 'Do I need to create an account to use AudioNest?',
    answer:
      'No. AudioNest requires no account, no login, and no email address. Open any tool and start using it immediately.',
  },
  {
    question: 'Are my audio files private? Does AudioNest upload my files?',
    answer:
      'Your files are completely private. AudioNest uses WebAssembly to run FFmpeg directly in your browser — all processing happens on your device. Your audio files never leave your computer. Nothing is stored on any server.',
  },
  {
    question: 'What audio formats does AudioNest support?',
    answer:
      'Most tools accept MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, and WMA. Some tools also accept video formats (MP4, MOV, MKV, AVI, WebM) for audio extraction. Output is typically MP3.',
  },
  {
    question: 'Can I use AudioNest on my iPhone or Android phone?',
    answer:
      'Yes. AudioNest works in any modern mobile browser (Safari on iPhone, Chrome on Android). Processing is done in the browser, so it works on mobile as long as you have enough available RAM for the file size you\'re working with.',
  },
  {
    question: 'What is the maximum file size I can process?',
    answer:
      'There is no hard server-side limit because processing happens in your browser. The practical limit depends on your device\'s available RAM. Files up to 500 MB work reliably on most computers. Very large files may be slow to process on older or memory-constrained devices.',
  },
  {
    question: 'How does AudioNest work without uploading files?',
    answer:
      'AudioNest loads FFmpeg — the industry-standard audio processing library — as WebAssembly directly into your browser. WebAssembly allows native-speed C code to run in the browser sandbox. Your file is read into browser memory, processed by FFmpeg locally, and the output is downloaded to your device.',
  },
  {
    question: 'What tools does AudioNest offer?',
    answer:
      'AudioNest includes: Audio Cutter, Audio Joiner, Audio Splitter, Audio Reverser, Speed Changer, Audio Converter, Video to Audio, Photo Audio to Video, Audio Compressor, Noise Remover, Silence Remover, Volume Booster, Audio Normalizer, Bass Booster, Pitch Shifter, Reverb Adder, Stereo to Mono, Mono to Stereo, BPM Detector, Loudness Meter, ID3 Tag Editor, Metadata Remover, Loop Maker, and Audio Info.',
  },
  {
    question: 'Does AudioNest work offline?',
    answer:
      'AudioNest requires an internet connection to load the application and FFmpeg WebAssembly in your browser. Once loaded, some processing steps may continue if the connection drops. For reliable offline use, the app needs the initial load to complete while online.',
  },
]

export function getToolFaqs(toolSlug: string): FAQ[] {
  return toolFaqs[toolSlug] ?? []
}
