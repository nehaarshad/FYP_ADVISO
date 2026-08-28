/* eslint-disable @typescript-eslint/no-explicit-any */
import { DegreeGuidlineModel } from "@/src/models/degreeGuidlineModel";
import { Program } from "@/src/models/programModel";

export interface DegreeGuidelinesManagementProps {
  onBack: () => void;
}

export interface FormData {
  title: string;
  description: string;
  programIds: number[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface GuidelineFormHookProps {
  createGuideline: (data: any) => Promise<any>;
  updateGuideline: (id: number, data: any) => Promise<any>;
  fetchGuidelines: (a?: any, b?: any, c?: boolean) => Promise<any>;
}

export interface GuidelineFiltersHookProps {
  guidelines: DegreeGuidlineModel[];
  programs: Program[];
  userProfile: any;
}