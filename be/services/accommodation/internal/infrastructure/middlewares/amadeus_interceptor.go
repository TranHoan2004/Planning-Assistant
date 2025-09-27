package middlewares

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"gitlab.com/plango-travel/backend/services/accommodation/internal/infrastructure/config"
	"go.uber.org/zap"
)

type TokenResponse struct {
	Type            string `json:"type,omitempty"`
	Username        string `json:"username,omitempty"`
	ApplicationName string `json:"application_name,omitempty"`
	TokenType       string `json:"token_type,omitempty"`
	AccessToken     string `json:"access_token,omitempty"`
	ExpiresIn       int    `json:"expires_in,omitempty"`
	State           string `json:"state,omitempty"`
	Scope           string `json:"scope,omitempty"`
}

type AmadeusInterceptor struct {
	client    *http.Client
	apiKey    string
	apiSecret string
	tokenURL  string
	log       *zap.Logger

	// Token management
	token     string
	expiresAt time.Time
	mutex     sync.RWMutex
}

func NewAmaduesInterceptor(cfg *config.Config, log *zap.Logger) *AmadeusInterceptor {
	return &AmadeusInterceptor{
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		apiKey:    cfg.AmadeusAPIKey,
		apiSecret: cfg.AmadeusAPISecret,
		tokenURL:  fmt.Sprintf("%s/v1/security/oauth2/token", cfg.AmadeusBaseURL),
		log:       log,
	}
}

func (a *AmadeusInterceptor) getToken() error {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", a.apiKey)
	data.Set("client_secret", a.apiSecret)

	req, err := http.NewRequest(http.MethodPost, a.tokenURL, strings.NewReader(data.Encode()))
	if err != nil {
		return fmt.Errorf("failed to create get token request: %v", err)
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	a.log.Info("Getting token", zap.String("url", a.tokenURL))
	resp, err := a.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to get token: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("token request failed with status %d: %v", resp.StatusCode, string(body))
	}

	var tokenResponse TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResponse); err != nil {
		return fmt.Errorf("failed to decode token response: %v", err)
	}
	a.log.Info("Got Access Token", zap.String("token", tokenResponse.AccessToken))

	a.mutex.Lock()
	a.token = tokenResponse.AccessToken
	a.expiresAt = time.Now().Add(time.Duration(tokenResponse.ExpiresIn-60) * time.Second)
	a.mutex.Unlock()

	return nil
}

// isTokenValid checks if the current token is still valid
func (a *AmadeusInterceptor) isTokenValid() bool {
	a.mutex.RLock()
	defer a.mutex.RUnlock()
	return a.token != "" && time.Now().Before(a.expiresAt)
}

// ensureValidToken ensures we have a valid token, refreshing if necessary
func (a *AmadeusInterceptor) ensureValidToken() error {
	if a.isTokenValid() {
		return nil
	}
	return a.getToken()
}

// RoundTripper implements http.RoundTripper interface for request interception
type AmadeusRoundTripper struct {
	interceptor *AmadeusInterceptor
	transport   http.RoundTripper
}

// RoundTrip intercepts requests and adds authentication
func (art *AmadeusRoundTripper) RoundTrip(req *http.Request) (*http.Response, error) {
	// Ensure we have a valid token
	if err := art.interceptor.ensureValidToken(); err != nil {
		return nil, fmt.Errorf("failed to get access token: %w", err)
	}

	// Clone the request to avoid modifying the original
	clonedReq := req.Clone(req.Context())

	// Add the Authorization header
	art.interceptor.mutex.RLock()
	clonedReq.Header.Set("Authorization", "Bearer "+art.interceptor.token)
	art.interceptor.mutex.RUnlock()

	// Use the underlying transport or default transport
	transport := art.transport
	if transport == nil {
		transport = http.DefaultTransport
	}

	return transport.RoundTrip(clonedReq)
}

// NewClient creates an HTTP client with the Amadeus interceptor
func (a *AmadeusInterceptor) NewClient() *http.Client {
	return &http.Client{
		Transport: &AmadeusRoundTripper{
			interceptor: a,
			transport:   http.DefaultTransport,
		},
		Timeout: 30 * time.Second,
	}
}
