package auth

import (
	"context"
	"log"
	"net/http"
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
	ExchangeAndVerify(ctx context.Context, code string) (*GoogleIdentity, error)
}

type googleOAuthClient struct {
	clientID     string
	clientSecret string
}

// NewGoogleOAuthVerifier constructs a Google OAuth code-exchange + ID token verifier.
// Returns nil when either credential is empty so local dev without Google OAuth stays non-blocking.
func NewGoogleOAuthVerifier(clientID, clientSecret string) GoogleOAuthVerifier {
	trimmedID := strings.TrimSpace(clientID)
	trimmedSecret := strings.TrimSpace(clientSecret)
	if trimmedID == "" || trimmedSecret == "" {
		return nil
	}
	return &googleOAuthClient{
		clientID:     trimmedID,
		clientSecret: trimmedSecret,
	}
}

func (c *googleOAuthClient) ExchangeAndVerify(ctx context.Context, code string) (*GoogleIdentity, error) {
	reqCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	httpClient := &http.Client{Timeout: 10 * time.Second}
	exchangeCtx := context.WithValue(reqCtx, oauth2.HTTPClient, httpClient)

	oauthCfg := &oauth2.Config{
		ClientID:     c.clientID,
		ClientSecret: c.clientSecret,
		RedirectURL:  "postmessage",
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
