export interface HotelBookingComRequest {
  hotel_id: string
  arrival_date: string
  departure_date: string
  adults?: number
  children_age?: string
  room_qty?: number
  languagecode?: string
  currency_code?: string
}

export type HotelPhotosResponse = {
  status: boolean
  message: string
  timestamp: number
  data: HotelPhoto[]
}

export type HotelBookingComResponse = {
  status: boolean
  message: string
  timestamp: number
  data: HotelData
}

interface HotelData {
  ufi: number
  hotel_id: number
  hotel_name: string
  url: string
  hotel_name_trans: string
  review_nr: number
  arrival_date: string
  departure_date: string
  price_transparency_mode: string
  accommodation_type_name: string
  latitude: number
  longitude: number
  address: string
  address_trans: string
  city: string
  city_trans: string
  city_in_trans: string
  city_name_en: string
  district: string
  countrycode: string
  distance_to_cc: number
  default_language: string
  country_trans: string
  currency_code: string
  zip: string
  timezone: string
  rare_find_state: string
  soldout: number
  available_rooms: number
  max_rooms_in_reservation: number
  average_room_size_for_ufi_m2: string
  is_family_friendly: number
  is_closed: number
  is_crimea: number
  is_hotel_ctrip: number
  is_price_transparent: number
  is_genius_deal: number
  is_cash_accepted_check_enabled: number
  qualifies_for_no_cc_reservation: number
  hotel_include_breakfast: number
  cc1: string
  family_facilities: string[]
  product_price_breakdown: ProductPriceBreakdown
  composite_price_breakdown: CompositePriceBreakdown
  property_highlight_strip: PropertyHighlight[]
  facilities_block: FacilitiesBlock
  top_ufi_benefits: TopUfiBenefit[]
  languages_spoken: LanguagesSpoken
  spoken_languages: string[]
  breakfast_review_score: BreakfastReviewScore
  wifi_review_score: WifiReviewScore
  min_room_distribution: MinRoomDistribution
  tax_exceptions: any[]
  booking_home: Record<string, any>
  aggregated_data: AggregatedData
  last_reservation: LastReservation
  free_facilities_cancel_breakfast: any[]
  room_recommendation: RoomRecommendation[]
  hotel_text: Record<string, any>
  districts: number[]
  preferences: Preference[]
  hotel_important_information_with_codes: any[]
  rooms: Record<string, Room>
  block: Block[]
  rawData: RawData
}

interface AmountObject {
  currency: string
  value: number
  amount_rounded: string
  amount_unrounded: string
}

interface PriceBreakdownItem {
  name: string
  kind: string
  base: {
    percentage?: number
    kind: string
  }
  inclusion_type?: string
  item_amount: AmountObject
  details: string
  identifier?: string
}

interface PriceDisplayConfig {
  key: string
  value: number
}

interface Benefit {
  icon: string | null
  identifier: string
  details: string
  name: string
  kind: string
  badge_variant: string
}

interface ProductPriceBreakdown {
  gross_amount_per_night: AmountObject
  items: PriceBreakdownItem[]
  included_taxes_and_charges_amount: AmountObject
  all_inclusive_amount: AmountObject
  all_inclusive_amount_hotel_currency: AmountObject
  has_long_stays_monthly_rate_price: number
  discounted_amount: AmountObject
  has_long_stays_weekly_rate_price: number
  charges_details: {
    amount: {
      value: number
      currency: string
    }
    mode: string
    translated_copy: string
  }
  excluded_amount: AmountObject
  gross_amount: AmountObject
  net_amount: AmountObject
  benefits: Benefit[]
  strikethrough_amount_per_night: AmountObject
  price_display_config: PriceDisplayConfig[]
  gross_amount_hotel_currency: AmountObject
  nr_stays: number
  strikethrough_amount: AmountObject
}

interface CompositePriceBreakdown {
  has_long_stays_monthly_rate_price: number
  has_long_stays_weekly_rate_price: number
  discounted_amount: AmountObject
  excluded_amount: AmountObject
  charges_details: {
    translated_copy: string
    mode: string
    amount: {
      value: number
      currency: string
    }
  }
  gross_amount_per_night: AmountObject
  items: PriceBreakdownItem[]
  included_taxes_and_charges_amount: AmountObject
  all_inclusive_amount_hotel_currency: AmountObject
  all_inclusive_amount: AmountObject
  gross_amount_hotel_currency: AmountObject
  price_display_config: PriceDisplayConfig[]
  strikethrough_amount: AmountObject
  gross_amount: AmountObject
  net_amount: AmountObject
  strikethrough_amount_per_night: AmountObject
  benefits: Benefit[]
}

interface IconList {
  icon: string
  size: number
}

interface PropertyHighlight {
  name: string
  icon_list: IconList[]
}

interface Facility {
  icon: string
  name: string
}

interface FacilitiesBlock {
  facilities: Facility[]
  name: string
  type: string
}

interface TopUfiBenefit {
  icon: string
  translated_name: string
}

interface LanguagesSpoken {
  languagecode: string[]
}

interface BreakfastReviewScore {
  review_score: number
  review_count: number
  review_snippet: string
  review_number: number
  review_score_word: string
  rating: number
}

interface WifiReviewScore {
  rating: number
}

interface MinRoomDistribution {
  adults: number
  children: any[]
}

interface AggregatedData {
  common_kitchen_fac: { id: number; name: string }[]
  has_nonrefundable: number
  has_kitchen: number
  has_refundable: number
  has_seating: number
}

interface LastReservation {
  country: string | null
  time: string
  countrycode: string | null
}

interface RoomRecommendation {
  babies: number
  total_extra_bed_price: number
  number_of_extra_beds_for_adults: number
  extra_beds_for_children_price: number
  extra_beds_for_adults_price: number
  number_of_extra_babycots: number
  extra_babycots_price_in_hotel_currency: number
  extra_beds_for_children_price_in_hotel_currency: number
  extra_beds_for_adults_price_in_hotel_currency: number
  adults: number
  number_of_extra_beds_for_children: number
  extra_babycots_price: number
  total_extra_bed_price_in_hotel_currency: number
  number_of_extra_beds_and_babycots_total: number
  block_id: string
  children: number
}

interface Preference {
  room_ids: string[]
  text: string
  id: string
  is_disabled: number
  choices: {
    description: string
    id: number
    selected?: number
    text: string
    on_select_text: string
  }[]
  icon_name: string
}

interface RoomHighlight {
  icon: string
  translated_name: string
  id?: number
}

interface RoomFacility {
  alt_facilitytype_id: number
  name: string
  id: number
  alt_facilitytype_name: string
  facilitytype_id: number
}

interface BedType {
  bed_type: number
  name: string
  description: string
  name_with_count: string
  description_imperial: string
  count: number
  description_localized: string | null
}

interface BedConfiguration {
  bed_types: BedType[]
}

interface AgeInterval {
  types_by_price: string[][]
  group_by_price: Record<string, string[]>
  extra_bed?: {
    price_type: string
    price_mode_n: number
    id: number
    price: string
    price_mode: string
    price_type_n: number
  }
  crib?: {
    price: number | string
    price_type: string
    price_mode: string
    guaranteed?: number
    id: number
    price_mode_n: number
    price_type_n: number
  }
  min_age: number
  max_age: number
}

interface ChildrenAndBedsText {
  children_at_the_property: {
    text: string
    highlight: number
  }[]
  cribs_and_extra_beds: {
    text: string
    highlight: number
  }[]
  allow_children: number
  age_intervals: AgeInterval[]
}

interface RoomPhoto {
  url_square60: string
  last_update_date: string
  photo_id: number
  url_square180: string
  url_max300: string
  url_original: string
  url_max1280: string
  url_max750: string
  ratio: number
  url_640x200: string
}

interface Room {
  cribs_extra_beds: {
    extra_beds: {
      ages: number[]
      max_count: number
      all_free: number
    }
  }
  highlights: RoomHighlight[]
  facilities: RoomFacility[]
  private_bathroom_count: number
  bed_configurations: BedConfiguration[]
  children_and_beds_text: ChildrenAndBedsText
  private_bathroom_highlight: {
    has_highlight: number
  }
  description: string
  photos: RoomPhoto[]
}

interface PaymentTermsStage {
  b_number?: number
  b_state?: string
  u_fee_pretty?: string
  effective_number?: number
  amount_pretty: string
  limit_from_raw?: string
  is_effective?: number
  u_fee_remaining?: string
  limit_from_time?: string
  limit_until_time?: string
  text?: string
  limit_until_date?: string
  u_stage_fee?: string
  fee_remaining?: number
  u_fee_remaining_pretty?: string
  u_fee?: string
  current_stage?: number
  limit_from_date?: string
  stage_fee?: number
  fee_pretty?: string
  fee?: number
  limit_until?: string
  is_free: number
  u_stage_fee_pretty?: string
  amount: string
  limit_from?: string
  fee_remaining_pretty?: string
  fee_rounded?: number
  limit_timezone?: string
  limit_until_raw?: string
  stage_fee_pretty?: string
  after_checkin?: number
  text_refundable?: string
  stage_translation?: string
}

interface PaymentTimeline {
  nr_stages: number
  stages: PaymentTermsStage[]
  policygroup_instance_id?: string
  u_currency_code?: string
  currency_code?: string
}

interface PaymentTerms {
  prepayment: {
    type_extended: string
    info: {
      date_before: string | null
      time_before_midnight: string | null
      timezone_offset: string | null
      is_midnight: string | null
      date: string | null
      refundable: string
      time: string | null
      prepayment_at_booktime: number
      timezone: string | null
    }
    type: string
    timeline: PaymentTimeline
    description: string
    extended_type_translation: string
    simple_translation: string
    type_translation: string
  }
  cancellation: {
    type_translation: string
    description: string
    type: string
    timeline: PaymentTimeline
    info: {
      timezone_offset: string | null
      date: string | null
      refundable_date: string | null
      date_before_raw: string | null
      time_before_midnight: string | null
      time: string | null
      refundable: number
      date_raw: string | null
      is_midnight: string | null
      timezone: string | null
      date_before: string | null
    }
    bucket: string
    non_refundable_anymore: number
    guaranteed_non_refundable: number
  }
}

interface BlockPolicy {
  content: string
  class: string
  mealplan_vector?: string
}

interface Block {
  full_board: number
  can_reserve_free_parking: number
  fit_occupancy: {
    children_ages: any[]
    nr_adults: number
  }
  fit_status: number
  refundable_until: string
  nr_adults: number
  is_genius_deal: any
  genius_discount_percentage: number
  is_last_minute_deal: number
  deposit_required: number
  is_domestic_rate: number
  extrabed_available_amount: any
  pod_ios_migrate_policies_to_smp_fullon: number
  paymentterms: PaymentTerms
  room_id: number
  number_of_bedrooms: number
  name_without_policy: string
  number_of_bathrooms: number
  babycots_available: number
  max_children_free_age: number
  mealplan: string
  block_text: {
    policies: BlockPolicy[]
  }
  roomtype_id: number
  is_block_fit: string
  children_ages: any[]
  bh_room_highlights: any[]
  room_surface_in_feet2: number
  block_id: string
  max_children_free: number
  room_name: string
  nr_children: number
  max_occupancy: string
  all_inclusive: number
  babycots_available_amount: any
  name: string
  is_flash_deal: number
  package_id: number
  must_reserve_free_parking: number
  refundable: number
  half_board: number
  smoking: number
  is_smart_deal: number
  room_count: number
  extrabed_available: number
  room_surface_in_m2: number
  breakfast_included: number
}

interface Price {
  amountRounded: string
  value: number
  currency: string
}

interface PriceBreakdown {
  taxExceptions: any[]
  benefitBadges: any[]
  grossPrice: Price
  strikethroughPrice?: Price
  chargesInfo: string
}

interface Checkin {
  untilTime: string
  fromTime: string
}

interface Checkout {
  untilTime: string
  fromTime: string
}

interface RawData {
  optOutFromGalleryChanges: number
  reviewScore: number
  isPreferredPlus: boolean
  id: number
  latitude: number
  ufi: number
  priceBreakdown: PriceBreakdown
  blockIds: string[]
  currency: string
  wishlistName: string
  position: number
  qualityClass: number
  checkin: Checkin
  checkoutDate: string
  rankingPosition: number
  accuratePropertyClass: number
  countryCode: string
  isHighlightedHotel: boolean
  checkinDate: string
  reviewCount: number
  reviewScoreWord: string
  photoUrls: string[]
  longitude: number
  isPreferred: boolean
  name: string
  mainPhotoId: number
  checkout: Checkout
  propertyClass: number
  isFirstPage: boolean
}

interface HotelPhoto {
  id: number
  url: string
}
