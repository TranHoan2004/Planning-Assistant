package dtos

type AmadeusHotelSearchResponse struct {
	Data []AmadeusHotel `json:"data"`
	Meta AmadeusMeta    `json:"meta"`
}

type AmadeusHotel struct {
	Subtype      string `json:"subtype"`
	Name         string `json:"name"`
	TimeZoneName string `json:"timeZoneName"`
	IotaCode     string `json:"iotaCode"`
	Address      struct {
		CountryCode string   `json:"countryCode,omitempty"`
		PostalCode  string   `json:"postalCode,omitempty"`
		CityName    string   `json:"cityName,omitempty"`
		Lines       []string `json:"lines,omitempty"`
	} `json:"address"`
	GeoCode struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	} `json:"geoCode"`
	HotelId   string `json:"hotelId"`
	ChainCode string `json:"chainCode"`
	Distance  struct {
		Unit         string `json:"unit"`
		Value        int    `json:"value"`
		DisplayValue string `json:"displayValue"`
		IsUnlimited  string `json:"isUnlimited"`
	} `json:"distance"`
	Rating     *int   `json:"rating,omitempty"`
	LastUpdate string `json:"lastUpdate"`
}

type AmadeusMeta struct {
	Count int          `json:"count"`
	Sort  []string     `json:"sort"`
	Links AmadeusLinks `json:"links"`
}

type AmadeusLinks struct {
	Self  string `json:"self"`
	First string `json:"first"`
	Prev  string `json:"prev"`
	Next  string `json:"next"`
	Last  string `json:"last"`
}

type AmadeusHotelOffersResponse struct {
	Data []AmadeusHotelOffers `json:"data"`
}

type AmadeusHotelOffers struct {
	Type      string              `json:"type"`
	Available bool                `json:"available"`
	Offers    []AmadeusHotelOffer `json:"offers"`
}

type AmadeusHotelOffer struct {
	Type            string                    `json:"type"`
	Id              string                    `json:"id"`
	CheckInDate     string                    `json:"checkInDate"`
	CheckOutDate    string                    `json:"checkOutDate"`
	RoomQuantity    int                       `json:"roomQuantity"`
	RateCode        string                    `json:"rateCode"`
	Category        string                    `json:"category"`
	Description     QualifiedFreeText         `json:"description"`
	Commission      AmadeusHotelCommission    `json:"commission"`
	BoardType       string                    `json:"boardType"`
	Room            AmadeusHotelRoomDetails   `json:"room"`
	Guests          AmadeusGuests             `json:"guests"`
	Price           AmadeusHotelPrice         `json:"price"`
	Policies        AmadeusHotelPolicyDetails `json:"policies"`
	RoomInformation QualifiedFreeText         `json:"roomInformation"`
}

type AmadeusHotelCommission struct {
	Percentage string `json:"percentage"`
	Amount     string `json:"amount"`
}

type AmadeusHotelRoomDetails struct {
	Type          string                        `json:"type"`
	TypeEstimated AmadeusHotelEstimatedRoomType `json:"typeEstimated"`
	Description   QualifiedFreeText             `json:"description"`
}

type AmadeusHotelEstimatedRoomType struct {
	Category    string            `json:"category"`
	Beds        int               `json:"beds"`
	BedType     string            `json:"bedType"`
	Description QualifiedFreeText `json:"description"`
}

type QualifiedFreeText struct {
	Text string `json:"text"`
	Lang string `json:"lang"`
}

type AmadeusHotelPrice struct {
	Currency     string `json:"currency"`
	SellingTotal string `json:"sellingTotal"`
	Total        string `json:"total"`
	Base         string `json:"base"`
	Markup       struct {
		Amount string `json:"amount"`
	} `json:"markup"`
}

type AmadeusHotelPriceVariations struct {
	Average AmadeusHotelPrice            `json:"average"`
	Changes []AmadeusHotelPriceVariation `json:"changes"`
}

type AmadeusHotelPriceVariation struct {
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	AmadeusHotelPrice
}

type AmadeusGuests struct {
	Adults    int   `json:"adults"`
	ChildAges []int `json:"childAges"`
}

type AmadeusHotelPolicyDetails struct {
	PaymentType  string                       `json:"paymentType"`
	Guarantee    AmadeusHotelGuaranteePolicy  `json:"guarantee"`
	Deposit      AmadeusHotelDepositPolicy    `json:"deposit"`
	Prepay       AmadeusHotelDepositPolicy    `json:"prepay"`
	HoldTime     AmadeusHotelHoldPolicy       `json:"holdTime"`
	Cancelations []AmadeusCancelationPolicy   `json:"cancelations"`
	CheckInOut   AmadeusHotelCheckInOutPolicy `json:"checkInOut"`
}

type AmadeusHotelGuaranteePolicy struct {
	Description      QualifiedFreeText         `json:"description"`
	AcceptedPayments AmadeusHotelPaymentPolicy `json:"acceptedPayments"`
}

type AmadeusHotelDepositPolicy struct {
	Amount           string                    `json:"amount"`
	Deadline         string                    `json:"deadline"`
	Description      QualifiedFreeText         `json:"description"`
	AcceptedPayments AmadeusHotelPaymentPolicy `json:"acceptedPayments"`
}

type AmadeusHotelHoldPolicy struct {
	Deadline string `json:"deadline"`
}

type AmadeusCancelationPolicy struct {
	Type           string            `json:"type"`
	Amount         string            `json:"amount"`
	NumberOfNights int               `json:"numberOfNights"`
	Percentage     string            `json:"percentage"`
	Deadline       string            `json:"deadline"`
	Description    QualifiedFreeText `json:"description"`
}

type AmadeusHotelCheckInOutPolicy struct {
	CheckIn             string            `json:"checkIn"`
	CheckInDescription  QualifiedFreeText `json:"checkInDescription"`
	CheckOut            string            `json:"checkOut"`
	CheckOutDescription QualifiedFreeText `json:"checkOutDescription"`
}

type AmadeusHotelPaymentPolicy struct {
	CreditCards []string `json:"creditCards"`
	Methods     []string `json:"methods"`
}
