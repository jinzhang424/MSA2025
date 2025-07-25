export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    bio: string,
    token: string,
    profileImage?: string,
    skills: string[]
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  availableSpots: number;
  totalSpots: number;
  skills: string[];
  ownerId: number;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ProjectApplication {
  id: number;
  projectId: number;
  project: Project;
  userId: number;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

export interface ProjectMember {
  id: number;
  projectId: number;
  project: Project;
  userId: number;
  user: User;
  role: 'member' | 'lead' | 'creator';
  joinedAt: string;
}

export interface IncomingApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    skills: string[];
  };
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

export interface ProjectApplicant {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  skills: string[];
  appliedAt: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export type DashboardTab = 
  'overview' | 
  'discover-projects' |
  'my-projects' | 
  'joined-projects' | 
  'applications' | 
  'chat' | 
  'settings' | 
  'create-project'
;

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  edited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
}

export interface ChatRoom {
  id: number;
  name: string;
  type: 'direct' | 'group' | 'project';
  participants: {
    id: number;
    name: string;
    avatar?: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: string;
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  projectId?: string; // if it's a project chat
  createdAt: string;
  updatedAt: string;
}
