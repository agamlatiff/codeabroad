package response

import (
	"errors"
	"log"
	"net/http"

	"merantalk/backend/internal/shared/apperror"
	"github.com/gin-gonic/gin"
)

type SuccessResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type ErrorResponse struct {
	Success bool           `json:"success"`
	Error   string         `json:"error"`
	Code    string         `json:"code"`
	Details map[string]any `json:"details,omitempty"`
}

func Success(c *gin.Context, statusCode int, message string, data any) {
	c.JSON(statusCode, SuccessResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func BadRequest(c *gin.Context, message string) {
	c.JSON(http.StatusBadRequest, ErrorResponse{
		Success: false,
		Error:   message,
		Code:    "BAD_REQUEST",
	})
}

// BindJSON binds request JSON and returns 413 Payload Too Large when BodySizeLimitMiddleware triggers MaxBytesError.
func BindJSON(c *gin.Context, dst any) bool {
	if err := c.ShouldBindJSON(dst); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			c.JSON(http.StatusRequestEntityTooLarge, ErrorResponse{
				Success: false,
				Error:   "ukuran payload request melebihi batas maksimal yang diizinkan",
				Code:    "PAYLOAD_TOO_LARGE",
			})
			return false
		}
		BadRequest(c, "format payload request tidak valid")
		return false
	}
	return true
}

func Error(c *gin.Context, err error) {
	if err == nil {
		return
	}

	var domainErr *apperror.DomainError
	if errors.As(err, &domainErr) && domainErr != nil {
		status := http.StatusInternalServerError
		switch domainErr.Type {
		case apperror.ErrorTypeBadRequest:
			status = http.StatusBadRequest
		case apperror.ErrorTypeNotFound:
			status = http.StatusNotFound
		case apperror.ErrorTypeConflict:
			status = http.StatusConflict
		case apperror.ErrorTypeUnauthorized:
			status = http.StatusUnauthorized
		case apperror.ErrorTypeForbidden:
			status = http.StatusForbidden
		}
		c.JSON(status, ErrorResponse{
			Success: false,
			Error:   domainErr.Message,
			Code:    domainErr.Code,
			Details: domainErr.Details,
		})
		return
	}

	switch {
	case errors.Is(err, apperror.ErrNotFound):
		c.JSON(http.StatusNotFound, ErrorResponse{
			Success: false,
			Error:   "resource not found",
			Code:    "NOT_FOUND",
		})
	case errors.Is(err, apperror.ErrConflict):
		c.JSON(http.StatusConflict, ErrorResponse{
			Success: false,
			Error:   "resource already exists",
			Code:    "CONFLICT",
		})
	case errors.Is(err, apperror.ErrUnauthorized):
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Success: false,
			Error:   "unauthorized",
			Code:    "UNAUTHORIZED",
		})
	case errors.Is(err, apperror.ErrForbidden):
		c.JSON(http.StatusForbidden, ErrorResponse{
			Success: false,
			Error:   "forbidden",
			Code:    "FORBIDDEN",
		})
	case errors.Is(err, apperror.ErrBadRequest):
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Success: false,
			Error:   "bad request",
			Code:    "BAD_REQUEST",
		})
	default:
		log.Printf("[ERROR 500] %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Success: false,
			Error:   "internal server error",
			Code:    "INTERNAL_ERROR",
		})
	}
}

