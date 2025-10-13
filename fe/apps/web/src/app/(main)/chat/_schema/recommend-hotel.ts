import z from "zod";

const RecommendedHotelSchema = z.object({

    hotel_id: z.string(),
    reason: z.string()
})

const HotelRecommendationSchema = z.object({
    time_interval: z.object({
        from_date: z.date(),
        to_date: z.date()
    }),
    recommended_hotels: z.array(RecommendedHotelSchema),
    search_summary: z.string().optional(),
    booking_tips: z.string().optional()
})

export type HotelRecommendation = z.infer<typeof HotelRecommendationSchema>
export type RecommendedHotel = z.infer<typeof RecommendedHotelSchema>
