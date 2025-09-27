package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"gitlab.com/plango-travel/backend/services/accommodation/internal/application/usecases"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/domain/valueobjects"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/config"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/dtos"
	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/middlewares"
	"go.uber.org/zap"
)

const (
	searchHotelByCityCodeEndpoint = "/v1/reference-data/locations/hotels/by-city"
	searchHotelByGeoCodeEndpoint  = "/v1/reference-data/locations/hotels/by-geo"
	hotelOffers                   = "/v3/shopping/hotel-offers"
)

type AmadeusService struct {
	httpClient *http.Client
	log        *zap.Logger
	apiBaseUrl string
}

var _ usecases.IHotelService = (*AmadeusService)(nil)

func NewAmadeusService(
	cfg *config.Config,
	amadeusInterceptor *middlewares.AmadeusInterceptor,
	log *zap.Logger,
) *AmadeusService {
	return &AmadeusService{
		httpClient: amadeusInterceptor.NewClient(),
		log:        log,
		apiBaseUrl: cfg.AmadeusBaseURL,
	}
}

// SearchHotelsByCityCode implements usecases.IHotelSearch.
func (a *AmadeusService) SearchHotelsByCityCode(cityCode string) ([]usecases.HotelResponse, error) {
	params := fmt.Sprintf("?cityCode=%s", cityCode)

	req, err := a.prepareRequest(http.MethodGet, searchHotelByCityCodeEndpoint+params, nil)
	if err != nil {
		return nil, err
	}
	a.log.Info("Sending request to Amadeus", zap.String("url", req.URL.String()))
	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status %d", resp.StatusCode)
	}

	var data dtos.AmadeusHotelSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	var hotels []usecases.HotelResponse
	for _, hotel := range data.Data {
		hotels = append(hotels, a.mapToHotel(&hotel))
	}

	return hotels, nil
}

// SearchHotelsByGeoCode implements usecases.IHotelSearch.
func (a *AmadeusService) SearchHotelsByGeoCode(latitude, longitude float64) ([]usecases.HotelResponse, error) {
	params := fmt.Sprintf("?latitude=%f&longitude=%f", latitude, longitude)

	req, err := a.prepareRequest(http.MethodGet, searchHotelByGeoCodeEndpoint+params, nil)
	if err != nil {
		return nil, err
	}
	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status %d", resp.StatusCode)
	}

	var data dtos.AmadeusHotelSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	var hotels []usecases.HotelResponse
	for _, hotel := range data.Data {
		hotels = append(hotels, a.mapToHotel(&hotel))
	}

	return hotels, nil
}

// GetHotelOffersDetail implements usecases.IHotelService.
func (a *AmadeusService) GetHotelOffersDetail(hotelId []string, offerParams *usecases.HotelOffersRequestParams) ([]dtos.AmadeusHotelOffers, error) {
	params := fmt.Sprintf("?hotelIds=%s", hotelId)

	if offerParams != nil && offerParams.Adults != nil {
		params += fmt.Sprintf("&adults=%d", *offerParams.Adults)
	}

	if offerParams != nil && offerParams.CheckInDate != nil {
		params += fmt.Sprintf("&checkInDate=%s", offerParams.CheckInDate.Format("2006-01-02"))
	}

	if offerParams != nil && offerParams.CheckOutDate != nil {
		params += fmt.Sprintf("&checkOutDate=%s", offerParams.CheckOutDate.Format("2006-01-02"))
	}

	if offerParams != nil && offerParams.RoomQuantity != nil {
		params += fmt.Sprintf("&roomQuantity=%d", *offerParams.RoomQuantity)
	}

	if offerParams != nil && offerParams.PriceRange != nil {
		params += fmt.Sprintf("&priceRange=%s", *offerParams.PriceRange)
	}

	if offerParams != nil && offerParams.Currency != nil {
		params += fmt.Sprintf("&currency=%s", *offerParams.Currency)
	}

	req, err := a.prepareRequest(http.MethodGet, hotelOffers+params, nil)
	if err != nil {
		return nil, err
	}
	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status %d", resp.StatusCode)
	}

	var data dtos.AmadeusHotelOffersResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}
	return data.Data, nil
}

// SearchHotelsByIds implements usecases.IHotelService.
func (a *AmadeusService) SearchHotelsByIds(ids []string) ([]usecases.HotelResponse, error) {
	params := fmt.Sprintf("?hotelIds=%s", ids)

	req, err := a.prepareRequest(http.MethodGet, searchHotelByCityCodeEndpoint+params, nil)
	if err != nil {
		return nil, err
	}
	resp, err := a.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status %d", resp.StatusCode)
	}

	var data dtos.AmadeusHotelSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	var hotels []usecases.HotelResponse
	for _, hotel := range data.Data {
		hotels = append(hotels, a.mapToHotel(&hotel))
	}

	return hotels, nil
}

func (a *AmadeusService) prepareRequest(method string, endpoint string, body io.Reader) (*http.Request, error) {
	req, err := http.NewRequest(method, a.apiBaseUrl+endpoint, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	return req, nil
}

func (a *AmadeusService) mapToHotel(hotel *dtos.AmadeusHotel) usecases.HotelResponse {
	return usecases.HotelResponse{
		Id:   hotel.HotelId,
		Name: hotel.Name,
		Address: valueobjects.Address{
			PostalCode: hotel.Address.PostalCode,
			CityName:   hotel.Address.CityName,
			Lines:      hotel.Address.Lines,
		},
		GeoCode: valueobjects.GeoCode{
			Latitude:  hotel.GeoCode.Latitude,
			Longitude: hotel.GeoCode.Longitude,
		},
		Rating: hotel.Rating,
	}
}
