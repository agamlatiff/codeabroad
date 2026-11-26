package auth

import (
	"context"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/idtoken"
)

const OAuthProviderGoogle = "google"

// GoogleIdentity contains verified user identity claims extracted from a Google ID token.
type GoogleIdentity struct {
	Subject       string
	Email         string
	EmailVerified bool
	Name          string
	Picture       string
}

// GoogleOAuthVerifier exchanges an authorization code and verifies the resulting Google ID token.
type GoogleOAuthVerifier interface {
	ExchangeAndVerify(ctx context.Context, code string, redirectURI string) (*GoogleIdentity, error)
}

type googleOAuthClient struct {
	clientID       string
	clientSecret   string
	allowedOrigins map[string]struct{}
}

// NewGoogleOAuthVerifier constructs a Google OAuth code-exchange + ID token verifier.
// Returns nil when either credential is empty so local dev without Google OAuth stays non-blocking.
func NewGoogleOAuthVerifier(clientID, clientSecret string) GoogleOAuthVerifier {
	return NewGoogleOAuthVerifierWithOrigins(clientID, clientSecret, nil)
}

// NewGoogleOAuthVerifierWithOrigins constructs a Google OAuth verifier with an explicit origin allowlist for redirect URIs.
func NewGoogleOAuthVerifierWithOrigins(clientID, clientSecret string, allowedOrigins []string) GoogleOAuthVerifier {
	trimmedID := strings.TrimSpace(clientID)
	trimmedSecret := strings.TrimSpace(clientSecret)
	if trimmedID == "" || trimmedSecret == "" {
		return nil
	}
	origins := make(map[string]struct{}, len(allowedOrigins))
	for _, raw := range allowedOrigins {
		u, err := url.Parse(strings.TrimSpace(raw))
		if err != nil || u.Scheme == "" || u.Host == "" {
			continue
		}
		origins[strings.ToLower(u.Scheme+"://"+u.Host)] = struct{}{}
	}
	return &googleOAuthClient{
		clientID:       trimmedID,
		clientSecret:   trimmedSecret,
		allowedOrigins: origins,
	}
}

func (c *googleOAuthClient) resolveRedirectURL(raw string) (string, bool) {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" || trimmed == "postmessage" {
		return "postmessage", true
	}
	u, err := url.Parse(trimmed)
	if err != nil || (u.Scheme != "https" && u.Scheme != "http") || u.Host == "" {
		return "", false
	}
	if u.Path != "/login" && u.Path != "/register" {
		return "", false
	}
	origin := strings.ToLower(u.Scheme + "://" + u.Host)
	if len(c.allowedOrigins) > 0 {
		if _, ok := c.allowedOrigins[origin]; !ok {
			return "", false
		}
	}
	return u.Scheme + "://" + u.Host + u.Path, true
}

func (c *googleOAuthClient) ExchangeAndVerify(ctx context.Context, code string, redirectURI string) (*GoogleIdentity, error) {
	resolvedRedirect, ok := c.resolveRedirectURL(redirectURI)
	if !ok {
		log.Printf("[WARN] [auth.GoogleOAuth] rejected disallowed redirect_uri: %q", redirectURI)
		return nil, ErrGoogleAuthFailed
	}

	reqCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	httpClient := &http.Client{Timeout: 10 * time.Second}
	exchangeCtx := context.WithValue(reqCtx, oauth2.HTTPClient, httpClient)

	oauthCfg := &oauth2.Config{
		ClientID:     c.clientID,
		ClientSecret: c.clientSecret,
		RedirectURL:  resolvedRedirect,
		Endpoint:     google.Endpoint,
		Scopes:       []string{"openid", "email", "profile"},
	}

	tok, err := oauthCfg.Exchange(exchangeCtx, code)
	if err != nil {
		log.Printf("[WARN] [auth.GoogleOAuth] failed to exchange authorization code: %v", err)
		return nil, ErrGoogleAuthFailed
	}

	rawIDToken, ok := tok.Extra("id_token").(string)
	if !ok || strings.TrimSpace(rawIDToken) == "" {
		log.Printf("[WARN] [auth.GoogleOAuth] missing id_token in token response")
		return nil, ErrGoogleAuthFailed
	}

	payload, err := idtoken.Validate(reqCtx, rawIDToken, c.clientID)
	if err != nil || payload == nil {
		log.Printf("[WARN] [auth.GoogleOAuth] invalid Google id_token: %v", err)
		return nil, ErrGoogleAuthFailed
	}

	if payload.Issuer != "https://accounts.google.com" && payload.Issuer != "accounts.google.com" {
		log.Printf("[WARN] [auth.GoogleOAuth] unexpected token issuer: %q", payload.Issuer)
		return nil, ErrGoogleAuthFailed
	}

	subject := strings.TrimSpace(payload.Subject)
	emailRaw, _ := payload.Claims["email"].(string)
	email := strings.ToLower(strings.TrimSpace(emailRaw))
	emailVerified, _ := payload.Claims["email_verified"].(bool)
	nameRaw, _ := payload.Claims["name"].(string)
	pictureRaw, _ := payload.Claims["picture"].(string)

	if subject == "" || email == "" {
		return nil, ErrGoogleAuthFailed
	}
	if !emailVerified {
		return nil, ErrGoogleEmailNotVerified
	}

	return &GoogleIdentity{
		Subject:       subject,
		Email:         email,
		EmailVerified: true,
		Name:          strings.TrimSpace(nameRaw),
		Picture:       strings.TrimSpace(pictureRaw),
	}, nil
}
