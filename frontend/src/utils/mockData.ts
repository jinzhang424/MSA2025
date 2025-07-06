// Mock data for dashboard components
import { type User, type Project, type ProjectApplication, type ProjectMembership, type IncomingApplication } from '../types/dashboard';

export const mockUser: User = {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    profilePicture: undefined,
    bio: 'Full-stack developer passionate about creating innovative solutions. I love working on projects that make a real impact.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS'],
    joinedDate: '2024-01-15'
};

export const mockProjects: Project[] = [
    {
        id: 'p1',
        title: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js. Features include product catalog, shopping cart, payment integration, and admin dashboard.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        category: 'Web Development',
        availableSpots: 2,
        totalSpots: 5,
        deadline: '2025-07-15',
        skills: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
        createdBy: mockUser.id,
        createdAt: '2025-06-01',
        status: 'active'
    },
    {
        id: 'p2',
        title: 'AI-Powered Learning Assistant',
        description: 'Educational app that uses machine learning to personalize learning experiences for students.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
        category: 'AI/ML',
        availableSpots: 1,
        totalSpots: 4,
        deadline: '2025-08-01',
        skills: ['Python', 'TensorFlow', 'React Native', 'NLP'],
        createdBy: mockUser.id,
        createdAt: '2025-05-15',
        status: 'active'
    }
];

export const mockApplications: ProjectApplication[] = [
    {
        id: 'app1',
        projectId: 'external-p1',
        project: {
            id: 'external-p1',
            title: 'Blockchain Voting System',
            description: 'Secure and transparent voting system using blockchain technology',
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
            category: 'Blockchain',
            availableSpots: 2,
            totalSpots: 4,
            deadline: '2025-08-30',
            skills: ['Solidity', 'Web3.js', 'React'],
            createdBy: 'other-user-1',
            createdAt: '2025-06-15',
            status: 'active'
        },
        userId: mockUser.id,
        status: 'pending',
        appliedAt: '2025-07-02',
        message: 'I have experience with blockchain development and would love to contribute to this important project.'
    }
];

export const mockMemberships: ProjectMembership[] = [
    {
        id: 'mem1',
        projectId: 'joined-p1',
        project: {
            id: 'joined-p1',
            title: 'Data Analytics Dashboard',
            description: 'Interactive dashboard for business intelligence and data visualization',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
            category: 'Data Science',
            availableSpots: 0,
            totalSpots: 3,
            deadline: '2025-07-25',
            skills: ['Python', 'Pandas', 'D3.js', 'PostgreSQL'],
            createdBy: 'other-user-2',
            createdAt: '2025-05-10',
            status: 'active'
        },
        userId: mockUser.id,
        role: 'lead',
        joinedAt: '2025-05-15'
    }
];

export const mockIncomingApplications: IncomingApplication[] = [
    {
        id: 'incoming1',
        projectId: 'p1',
        projectTitle: 'E-commerce Platform',
        applicant: {
            id: 'applicant1',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice.johnson@example.com',
            profilePicture: undefined,
            skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
        },
        status: 'pending',
        appliedAt: '2025-07-03',
        message: 'I\'m a full-stack developer with 5 years of experience. I\'ve built several e-commerce platforms and would love to contribute to your project.'
    }
];

// Utility functions
export const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
};

export const getDaysUntilDeadline = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffInMs = deadlineDate.getTime() - now.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
