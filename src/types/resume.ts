export interface Profile {
  name: string
  title: string
  summary: string
  motto?: string
  avatar?: string
  location: string
}

export interface ProjectLinks {
  demo?: string
}

export type ProjectCategory = 'work' | 'personal' | 'ai'

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  company: string
  introduction: string
  skills: string[]
  responsibilities?: string[]
  outcomes?: string[]
  categories: ProjectCategory[]
  image?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  period: string
  highlights: string[]
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface HobbyPhoto {
  id: string
  src: string
  caption?: string
}

export interface ReadingItem {
  id: string
  title: string
  author?: string
}

export interface ReadingLists {
  read: ReadingItem[]
  reading: ReadingItem[]
  wish: ReadingItem[]
}

export interface MountainPeak {
  id: string
  name: string
  region?: string
  elevation?: string
}

export interface MusicTrack {
  id: string
  title: string
  artist: string
  audio?: string
}

export interface AboutTag {
  id: string
  slug: string
  name: string
  icon?: string
  detail?: string
  photos?: HobbyPhoto[]
  reading?: ReadingLists
  peaks?: MountainPeak[]
  tracks?: MusicTrack[]
}

export interface About {
  quote: Quote
  credentials: AboutTag[]
  hobbies: AboutTag[]
}

export interface ContactItem {
  id: string
  label: string
  value: string
  href?: string
  copyable?: boolean
}

export interface Quote {
  id: string
  text: string
  author?: string
}

export interface Contact {
  quotes: Quote[]
  items: ContactItem[]
  /** Optional WeChat QR image URL (e.g. /wechat-qr.png) */
  wechatQr?: string
}

export interface Resume {
  profile: Profile
  projects: Project[]
  experience: Experience[]
  skills: SkillGroup[]
  about: About
  contact: Contact
}

export type SectionId =
  | 'hero'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'about'
  | 'contact'

export interface NavItem {
  id: SectionId
  label: string
}
