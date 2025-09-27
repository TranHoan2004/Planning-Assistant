import { z } from 'zod'

const CurrencySchema = z.enum(['USD', 'VND'])

const EstimatedCostSchema = z.object({
  min: z.number().min(0).describe('Minimum estimated cost'),
  max: z.number().min(0).describe('Maximum estimated cost'),
  currency: CurrencySchema.describe('Currency of the cost')
})

const TripSummarySchema = z.object({
  total_days: z.number().int().min(1).describe('Number of travel days'),
  destinations: z
    .array(z.string().min(1))
    .min(1)
    .describe('List of destinations covered'),
  estimated_total_budget: EstimatedCostSchema.describe(
    'Estimated budget for the whole trip'
  )
})

const ItineraryDaySchema = z.object({
  /** Date for this day's activities */
  date_: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .describe("Date for this day's activities"),
  /** City or destination for the day */
  location: z.string().min(1).describe('City or destination for the day'),
  /** Morning activity description */
  morning: z.string().min(1).describe('Morning activity description'),
  /** Afternoon activity description */
  afternoon: z.string().min(1).describe('Afternoon activity description'),
  /** Evening activity description */
  evening: z.string().min(1).describe('Evening activity description'),
  /** Suggested local dishes or restaurants */
  meals: z
    .array(z.string().min(1))
    .min(1)
    .describe('Suggested local dishes or restaurants'),
  /** Transportation used during this day */
  transportation: z
    .string()
    .min(1)
    .describe('Transportation used during this day'),
  /** Estimated cost for this day */
  estimated_cost: EstimatedCostSchema.describe('Estimated cost for this day')
})

const ItineraryResponseSchema = z.object({
  /** Overall summary of the trip */
  trip_summary: TripSummarySchema.describe('Overall summary of the trip'),
  /** Day-by-day itinerary */
  itinerary: z
    .array(ItineraryDaySchema)
    .min(1)
    .describe('Day-by-day itinerary'),
  /** Extra tips, cultural advice, or booking recommendations */
  notes: z
    .string()
    .optional()
    .describe('Extra tips, cultural advice, or booking recommendations')
})

export type Currency = z.infer<typeof CurrencySchema>
export type EstimatedCost = z.infer<typeof EstimatedCostSchema>
export type TripSummary = z.infer<typeof TripSummarySchema>
export type ItineraryDay = z.infer<typeof ItineraryDaySchema>
export type ItineraryResponse = z.infer<typeof ItineraryResponseSchema>
