import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/projects';
import type { NewLogEntryPayload } from '../types';

export const getProjects = () => mockRequest(() => server.listProjects());

export const getProject = (projectId: string) => mockRequest(() => server.getProject(projectId));

export const addLogEntry = (payload: NewLogEntryPayload) => mockRequest(() => server.addLogEntry(payload));

export const prepareReport = (projectId: string) => mockRequest(() => server.prepareReport(projectId));

export const publishOnShowcase = (projectId: string) => mockRequest(() => server.publishOnShowcase(projectId));
