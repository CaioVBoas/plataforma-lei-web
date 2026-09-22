/**
 * Reserva é a "candidatura" do docente a uma demanda: ele segura a demanda por
 * cinco dias úteis enquanto decide se vincula a uma disciplina.
 */
export type ReservationKind = 'active' | 'released' | 'expired';

export interface Reservation {
  demandId: string;
  kind: ReservationKind;
  organizationName: string;
  organizationType: string;
  problem: string;
  intendedDiscipline: string;
  daysLeft: number;
  expiredOn?: string;
  hasUnansweredQuestion: boolean;
  /** Se a demanda voltou ao cardápio ou já foi reservada por outro docente. */
  demandAvailable: boolean;
}

export type ReservationsByKind = Record<ReservationKind, Reservation[]>;
