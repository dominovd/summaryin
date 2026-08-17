export type GeneratorFamily =
  | 'healthcare'
  | 'hospitality'
  | 'customer-office'
  | 'business'
  | 'operations-safety'
  | 'education';

export const GENERATOR_FAMILIES: Record<string, GeneratorFamily> = {
  nursing: 'healthcare',
  server: 'hospitality',
  bartender: 'hospitality',
  waitress: 'hospitality',
  'customer-service': 'customer-office',
  receptionist: 'customer-office',
  'administrative-assistant': 'customer-office',
  'hr-assistant': 'customer-office',
  'project-manager': 'business',
  sales: 'business',
  accountant: 'business',
  retail: 'business',
  'store-manager': 'business',
  warehouse: 'operations-safety',
  driver: 'operations-safety',
  'security-guard': 'operations-safety',
  'correctional-officer': 'operations-safety',
  teacher: 'education',
};
