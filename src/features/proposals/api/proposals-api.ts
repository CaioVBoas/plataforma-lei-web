import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/proposals';
import type { SaveProposalPayload } from '../types';

export const getProposals = () => mockRequest(() => server.listProposals());

export const getProposal = (proposalId: string) => mockRequest(() => server.getProposal(proposalId));

export const saveProposal = (payload: SaveProposalPayload) => mockRequest(() => server.saveProposal(payload));

export const registerProposal = (proposalId: string, isoDate: string) =>
  mockRequest(() => server.registerProposal(proposalId, isoDate));

export const toggleProposalArchive = (proposalId: string) => mockRequest(() => server.toggleProposalArchive(proposalId));
