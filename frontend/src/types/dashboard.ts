export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  skills: string[];
  joinedDate: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  availableSpots: number;
  totalSpots: number;
  deadline?: string;
  skills: string[];
  createdBy: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  project: Project;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

export interface ProjectMembership {
  id: string;
  projectId: string;
  project: Project;
  userId: string;
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

export interface ProjectMember {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  role: 'member' | 'lead' | 'creator';
  skills: string[];
  joinedAt: string;
  status: 'active' | 'inactive';
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

export type DashboardTab = 'overview' | 'my-projects' | 'joined-projects' | 'applications' | 'chat' | 'settings';

export interface ChatMessage {
  id: string;
  senderId: string;
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
    id: string;
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
