package domain

import "errors"

var (
	// Root Sentinel Errors
	ErrNotFound     = errors.New("resource not found")
	ErrConflict     = errors.New("resource already exists")
	ErrUnauthorized = errors.New("unauthorized")
	ErrBadRequest   = errors.New("bad request")
	ErrForbidden    = errors.New("forbidden")
	ErrInternal     = errors.New("internal server error")
)
