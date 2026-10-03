package response

import (
	"errors"
	"net/http"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

type SuccessResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

type ErrorResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
	Code    string `json:"code"`
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

func Error(c *gin.Context, err error) {
	switch {
	case errors.Is(err, domain.ErrNotFound):
		c.JSON(http.StatusNotFound, ErrorResponse{
			Success: false,
			Error:   err.Error(),
			Code:    "NOT_FOUND",
		})
	case errors.Is(err, domain.ErrConflict):
		c.JSON(http.StatusConflict, ErrorResponse{
			Success: false,
			Error:   err.Error(),
			Code:    "CONFLICT",
		})
	case errors.Is(err, domain.ErrUnauthorized):
		c.JSON(http.StatusUnauthorized, ErrorResponse{
			Success: false,
			Error:   err.Error(),
			Code:    "UNAUTHORIZED",
		})
	case errors.Is(err, domain.ErrForbidden):
		c.JSON(http.StatusForbidden, ErrorResponse{
			Success: false,
			Error:   err.Error(),
			Code:    "FORBIDDEN",
		})
	case errors.Is(err, domain.ErrBadRequest):
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Success: false,
			Error:   err.Error(),
			Code:    "BAD_REQUEST",
		})
	default:
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Success: false,
			Error:   "an internal server error occurred",
			Code:    "INTERNAL_ERROR",
		})
	}
}