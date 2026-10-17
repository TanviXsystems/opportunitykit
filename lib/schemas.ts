import { z } from 'zod';

/**
 * Typed schemas used for input validation and for validating
 * requirement-extraction output before it enters the eligibility engine.
 */

export const RequirementTypeSchema = z.enum([
  'degree',
  'cgpa',
  'skill',
  'availability',
  'relocation',
  'work_authorization',
  'document',
  'other',
]);

export const ExtractedRequirementSchema = z.object({
  id: z.string().min(1),
  type: RequirementTypeSchema,
  text: z.string().min(1),
  expected: z.string().min(1),
  source: z.enum(['parsed', 'manual']),
  sourceLine: z.string().optional(),
});

export const ExtractedOpportunitySchema = z.object({
  title: z.string().min(1),
  source: z.string(),
  description: z.string(),
  requirements: z.array(ExtractedRequirementSchema).min(0),
});

export const OpportunityInputSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters.'),
  source: z.string().max(200).optional().default(''),
  description: z
    .string()
    .min(40, 'Add at least a short description (40+ characters) so requirements can be extracted.'),
});

export const ManualRequirementSchema = z.object({
  type: RequirementTypeSchema,
  text: z.string().min(5, 'Describe the requirement in at least 5 characters.'),
  expected: z.string().min(1).default('unspecified'),
});

export const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  degree: z.string().min(1, 'Degree is required.'),
  degreeField: z.string().min(1, 'Field of study is required (e.g. Computer Science).'),
  year: z.string().min(1, 'Select the current year.'),
  expectedGraduation: z.string().regex(/^\d{4}$/, 'Enter a 4-digit year, e.g. 2027.'),
  cgpa: z
    .union([z.literal(''), z.string().regex(/^\d{1}(\.\d{1,2})?$/, 'Enter a CGPA between 0 and 10, e.g. 7.2')])
    .optional(),
  skills: z.string(),
  location: z.string().min(1, 'Location is required.'),
  availableDurationMonths: z.string().optional(),
  willingToRelocate: z.enum(['unknown', 'yes', 'no']),
  citizenship: z.string().min(1, 'Citizenship / work authorization is required.'),
  resume: z.boolean(),
  transcript: z.boolean(),
  passport: z.boolean(),
});
