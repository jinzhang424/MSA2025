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

export type DashboardTab = 'overview' | 'my-projects' | 'joined-projects' | 'applications' | 'settings';
