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

type ErrorType string

const (
	ErrorTypeNotFound     ErrorType = "NOT_FOUND"
	ErrorTypeBadRequest   ErrorType = "BAD_REQUEST"
	ErrorTypeConflict     ErrorType = "CONFLICT"
	ErrorTypeUnauthorized ErrorType = "UNAUTHORIZED"
	ErrorTypeForbidden    ErrorType = "FORBIDDEN"
	ErrorTypeInternal     ErrorType = "INTERNAL_ERROR"
)

type DomainError struct {
	Type    ErrorType      `json:"-"`
	Code    string         `json:"code"`
	Message string         `json:"message"`
	Details map[string]any `json:"details,omitempty"`
	Err     error          `json:"-"` 
}

func (e *DomainError) Error() string {
	return e.Message
}
func (e *DomainError) Unwrap() error {
	if e.Err != nil {
		return e.Err
	}
	switch e.Type {
	case ErrorTypeNotFound:
		return ErrNotFound
	case ErrorTypeConflict:
		return ErrConflict
	case ErrorTypeUnauthorized:
		return ErrUnauthorized
	case ErrorTypeForbidden:
		return ErrForbidden
	case ErrorTypeBadRequest:
		return ErrBadRequest
	default:
		return ErrInternal
	}
}

func (e *DomainError) Is(target error) bool {
	if t, ok := target.(*DomainError); ok {
		return e.Code == t.Code
	}
	return errors.Is(e.Unwrap(), target)
}

func NewBadRequestError(code, message string, details map[string]any) *DomainError {
	return &DomainError{Type: ErrorTypeBadRequest, Code: code, Message: message, Details: details}
}

func NewNotFoundError(code, message string) *DomainError {
	return &DomainError{Type: ErrorTypeNotFound, Code: code, Message: message}
}

func NewConflictError(code, message string) *DomainError {
	return &DomainError{Type: ErrorTypeConflict, Code: code, Message: message}
}

func NewUnauthorizedError(code, message string) *DomainError {
	return &DomainError{Type: ErrorTypeUnauthorized, Code: code, Message: message}
}

func NewForbiddenError(code, message string, details map[string]any) *DomainError {
	return &DomainError{Type: ErrorTypeForbidden, Code: code, Message: message, Details: details}
}



