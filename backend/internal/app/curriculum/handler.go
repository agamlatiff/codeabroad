package curriculum

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"

	"codeabroad/backend/internal/shared/apperror"
	"codeabroad/backend/internal/shared/middleware"
	"codeabroad/backend/internal/shared/response"
	"github.com/gin-gonic/gin"
)

var lessonSlugRegex = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)

func isValidLessonIdentifier(val string) bool {
	trimmed := strings.TrimSpace(val)
	if trimmed == "" || len(trimmed) > 160 {
		return false
	}
	if apperror.ValidateEntityUUID(trimmed) == nil {
		return true
	}
	return len(trimmed) >= 2 && lessonSlugRegex.MatchString(trimmed)
}

type grammarFilterUsecase interface {
	GetGrammarPointsByLevelFilter(ctx context.Context, userID string, languageCode string, levelCode string) ([]GrammarPoint, error)
}

// Handler handles HTTP requests for curriculum navigation and lesson completion
type Handler struct {
	curriculumUsecase   Usecase
	completeRateLimiter gin.HandlerFunc
}

// NewHandler creates a new Curriculum Handler instance
func NewHandler(curriculumUsecase Usecase) *Handler {
	return NewHandlerWithRateLimiter(curriculumUsecase, nil)
}

// NewHandlerWithRateLimiter creates a new Curriculum Handler instance with a custom lesson-completion rate limiter
func NewHandlerWithRateLimiter(curriculumUsecase Usecase, completeRateLimiter gin.HandlerFunc) *Handler {
	if completeRateLimiter == nil {
		completeRateLimiter = middleware.UserOrIPRateLimitMiddleware(
			30,
			time.Minute,
			"terlalu banyak percobaan penyelesaian lesson, silakan tunggu sebentar",
		)
	}
	return &Handler{
		curriculumUsecase:   curriculumUsecase,
		completeRateLimiter: completeRateLimiter,
	}
}

// GetCurriculum handles GET /api/v1/curriculum
func (h *Handler) GetCurriculum(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	var req GetCurriculumRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		response.BadRequest(c, "invalid language_id query parameter format")
		return
	}

	res, err := h.curriculumUsecase.GetCurriculum(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "curriculum retrieved successfully", res)
}

// GetLessonDetail handles GET /api/v1/curriculum/lessons/:id
func (h *Handler) GetLessonDetail(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	lessonParam := strings.TrimSpace(c.Param("id"))
	if !isValidLessonIdentifier(lessonParam) {
		response.BadRequest(c, "invalid lesson identifier format")
		return
	}

	lesson, err := h.curriculumUsecase.GetLessonDetail(c.Request.Context(), userID, lessonParam)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson detail retrieved successfully", lesson)
}

// CompleteLesson handles POST /api/v1/curriculum/lessons/:id/complete
func (h *Handler) CompleteLesson(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	lessonParam := strings.TrimSpace(c.Param("id"))
	if !isValidLessonIdentifier(lessonParam) {
		response.BadRequest(c, "invalid lesson identifier format")
		return
	}

	var req CompleteLessonRequest
	if c.Request.Body != nil && c.Request.Body != http.NoBody {
		if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
			var maxBytesErr *http.MaxBytesError
			if errors.As(err, &maxBytesErr) {
				c.JSON(http.StatusRequestEntityTooLarge, response.ErrorResponse{
					Success: false,
					Error:   "ukuran payload request melebihi batas maksimal yang diizinkan",
					Code:    "PAYLOAD_TOO_LARGE",
				})
				return
			}
			response.BadRequest(c, completeLessonBindErrorMessage(err))
			return
		}
	}
	req.LessonID = lessonParam

	res, err := h.curriculumUsecase.CompleteLesson(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "lesson completed successfully", res)
}

func completeLessonBindErrorMessage(err error) string {
	var unmarshalErr *json.UnmarshalTypeError
	if errors.As(err, &unmarshalErr) {
		switch unmarshalErr.Field {
		case "score":
			return "invalid request payload: score must be an integer between 0 and 100"
		case "lesson_id":
			return "invalid request payload: lesson_id must be a valid UUID"
		default:
			return "invalid request payload"
		}
	}

	errMsg := err.Error()
	if strings.Contains(errMsg, "CompleteLessonRequest.LessonID") {
		return "invalid request payload: lesson_id must be a valid UUID"
	}
	if strings.Contains(errMsg, "CompleteLessonRequest.Score") {
		return "invalid request payload: score must be an integer between 0 and 100"
	}
	return "invalid request payload"
}

// GetGrammarPoints handles GET /api/v1/curriculum/grammar-points?level_id=... or ?lang=ja&level_code=N5
func (h *Handler) GetGrammarPoints(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}

	rawLevelID := strings.TrimSpace(c.Query("level_id"))
	if rawLevelID != "" {
		var query struct {
			LevelID string `form:"level_id" binding:"required,uuid"`
		}
		if err := c.ShouldBindQuery(&query); err != nil {
			response.BadRequest(c, "level_id query parameter is required and must be a valid UUID")
			return
		}

		points, err := h.curriculumUsecase.GetGrammarPoints(c.Request.Context(), userID, query.LevelID)
		if err != nil {
			response.Error(c, err)
			return
		}

		response.Success(c, http.StatusOK, "grammar points retrieved successfully", points)
		return
	}

	lang := strings.TrimSpace(c.Query("lang"))
	levelCode := strings.TrimSpace(c.Query("level_code"))
	if lang == "" && levelCode == "" {
		response.BadRequest(c, "level_id or level_code query parameter is required")
		return
	}

	if filterUC, ok := h.curriculumUsecase.(grammarFilterUsecase); ok {
		points, err := filterUC.GetGrammarPointsByLevelFilter(c.Request.Context(), userID, lang, levelCode)
		if err != nil {
			response.Error(c, err)
			return
		}
		response.Success(c, http.StatusOK, "grammar points retrieved successfully", points)
		return
	}

	response.BadRequest(c, "level_id query parameter is required and must be a valid UUID")
}

// RegisterRoutes registers curriculum routes under the protected group
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	if authMiddleware == nil {
		panic("curriculum.Handler.RegisterRoutes requires non-nil authMiddleware")
	}
	curriculum := rg.Group("/curriculum")
	curriculum.Use(authMiddleware)
	completeRateLimiter := h.completeRateLimiter
	if completeRateLimiter == nil {
		completeRateLimiter = middleware.UserOrIPRateLimitMiddleware(
			30,
			time.Minute,
			"terlalu banyak percobaan penyelesaian lesson, silakan tunggu sebentar",
		)
	}
	{
		curriculum.GET("", h.GetCurriculum)
		curriculum.GET("/lessons/:id", h.GetLessonDetail)
		curriculum.POST("/lessons/:id/complete", completeRateLimiter, h.CompleteLesson)
		curriculum.GET("/grammar-points", h.GetGrammarPoints)
	}
}

