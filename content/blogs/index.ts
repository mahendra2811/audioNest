export type { BlogPost } from './_types'

import audioCutter from './audio-cutter'
import audioJoiner from './audio-joiner'
import audioSplitter from './audio-splitter'
import audioConverter from './audio-converter'
import remainingTools from './remaining-tools'

export const allBlogs = [
  ...audioCutter,
  ...audioJoiner,
  ...audioSplitter,
  ...audioConverter,
  ...remainingTools,
]
