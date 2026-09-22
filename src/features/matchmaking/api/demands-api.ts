import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/demands';
import type { LinkDisciplinePayload, MessageRecipient } from '../types';

/*
 * Contrato do cliente com o backend de demandas. Hoje responde pelo backend
 * simulado em src/mocks; ao integrar a API real, só o corpo destas funções
 * muda (ex.: `api.get('/demands')`).
 */

export const getDemands = () => mockRequest(() => server.listDemands());

export const getDemandDetail = (demandId: string) => mockRequest(() => server.getDemandDetail(demandId));

export const getMatchExplanation = (demandId: string, disciplineId: string) =>
  mockRequest(() => server.getMatchExplanation(demandId, disciplineId));

export const getCompetencyReading = (demandId: string) => mockRequest(() => server.getCompetencyReading(demandId));

export const getCompetencyCatalog = () => mockRequest(() => server.listCompetencyCatalog());

export const getColleagues = () => mockRequest(() => server.listColleagues());

export const reserveDemand = (demandId: string) => mockRequest(() => server.reserveDemand(demandId));

export const releaseReservation = (demandId: string) => mockRequest(() => server.releaseReservation(demandId));

export const confirmCompetency = (demandId: string, name: string) => mockRequest(() => server.confirmCompetency(demandId, name));

export const removeCompetency = (demandId: string, name: string) => mockRequest(() => server.removeCompetency(demandId, name));

export const addCompetency = (demandId: string, name: string) => mockRequest(() => server.addCompetency(demandId, name));

export const associateExcerpt = (demandId: string, excerpt: string, competency: string) =>
  mockRequest(() => server.associateExcerpt(demandId, excerpt, competency));

export const sendQuestion = (demandId: string, recipient: MessageRecipient, text: string) =>
  mockRequest(() => server.sendQuestion(demandId, recipient, text));

export const linkDiscipline = (payload: LinkDisciplinePayload) => mockRequest(() => server.linkDiscipline(payload));
