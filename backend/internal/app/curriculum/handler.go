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

	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/middleware"
	"merantalk/backend/internal/shared/response"
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

type kanaUsecase interface {
	GetKanaChart(ctx context.Context, userID string, script string) (*KanaChartResponse, error)
	SubmitKanaPractice(ctx context.Context, userID string, req *KanaPracticeRequest) (*KanaPracticeResponse, error)
}

type grammarCheckUsecase interface {
	SubmitGrammarCheck(ctx context.Context, userID string, grammarPointIDOrCode string, req *SubmitGrammarCheckRequest) (*SubmitGrammarCheckResponse, error)
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

// GetCurriculum handles GET /api/v1/curriculum (supports authenticated learners & unauthenticated guest preview)
func (h *Handler) GetCurriculum(c *gin.Context) {
	userID := c.GetString("userID")

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

// GetLessonDetail handles GET /api/v1/curriculum/lessons/:id (supports Unit-1 trial preview for guests)
func (h *Handler) GetLessonDetail(c *gin.Context) {
	userID := c.GetString("userID")

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

// GetKanaChart handles GET /api/v1/curriculum/kana?script=hiragana|katakana|kanji
func (h *Handler) GetKanaChart(c *gin.Context) {
	userID := c.GetString("userID")
	script := strings.TrimSpace(c.Query("script"))
	if script != "" &&
		!strings.EqualFold(script, "hiragana") &&
		!strings.EqualFold(script, "katakana") &&
		!strings.EqualFold(script, "kanji") &&
		!strings.EqualFold(script, "all") {
		response.BadRequest(c, "script must be hiragana, katakana, or kanji")
		return
	}
	kanaUC, ok := h.curriculumUsecase.(kanaUsecase)
	if !ok {
		response.Success(c, http.StatusOK, "kana chart retrieved successfully", &KanaChartResponse{
			Script:     script,
			Characters: []KanaCharacterItem{},
		})
		return
	}
	chart, err := kanaUC.GetKanaChart(c.Request.Context(), userID, script)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Success(c, http.StatusOK, "kana chart retrieved successfully", chart)
}

// SubmitKanaPractice handles POST /api/v1/curriculum/kana/practice
func (h *Handler) SubmitKanaPractice(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}
	var req KanaPracticeRequest
	if !response.BindJSON(c, &req) {
		return
	}
	kanaUC, ok := h.curriculumUsecase.(kanaUsecase)
	if !ok {
		response.Success(c, http.StatusOK, "kana practice recorded successfully", &KanaPracticeResponse{})
		return
	}
	res, err := kanaUC.SubmitKanaPractice(c.Request.Context(), userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Success(c, http.StatusOK, "kana practice recorded successfully", res)
}

// SubmitGrammarCheck handles POST /api/v1/curriculum/grammar-points/:id/check
func (h *Handler) SubmitGrammarCheck(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, apperror.ErrUnauthorized)
		return
	}
	idOrCode := strings.TrimSpace(c.Param("id"))
	if idOrCode == "" || len(idOrCode) > 64 {
		response.BadRequest(c, "grammar point identifier is required")
		return
	}
	var req SubmitGrammarCheckRequest
	if !response.BindJSON(c, &req) {
		return
	}
	checkUC, ok := h.curriculumUsecase.(grammarCheckUsecase)
	if !ok {
		response.Success(c, http.StatusOK, "grammar check recorded successfully", &SubmitGrammarCheckResponse{})
		return
	}
	res, err := checkUC.SubmitGrammarCheck(c.Request.Context(), userID, idOrCode, &req)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Success(c, http.StatusOK, "grammar check recorded successfully", res)
}

// RegisterRoutes registers curriculum routes with optional-auth read previews and protected progress mutations
func (h *Handler) RegisterRoutes(rg *gin.RouterGroup, authMiddleware gin.HandlerFunc, optionalAuthMiddleware ...gin.HandlerFunc) {
	if authMiddleware == nil {
		panic("curriculum.Handler.RegisterRoutes requires non-nil authMiddleware")
	}
	completeRateLimiter := h.completeRateLimiter
	if completeRateLimiter == nil {
		completeRateLimiter = middleware.UserOrIPRateLimitMiddleware(
			30,
			time.Minute,
			"terlalu banyak percobaan penyelesaian lesson, silakan tunggu sebentar",
		)
	}

	readMiddleware := authMiddleware
	if len(optionalAuthMiddleware) > 0 && optionalAuthMiddleware[0] != nil {
		readMiddleware = optionalAuthMiddleware[0]
	}

	curriculumPreview := rg.Group("/curriculum")
	curriculumPreview.Use(readMiddleware)
	{
		curriculumPreview.GET("", h.GetCurriculum)
		curriculumPreview.GET("/lessons/:id", h.GetLessonDetail)
		curriculumPreview.GET("/grammar-points", h.GetGrammarPoints)
		curriculumPreview.GET("/kana", h.GetKanaChart)
	}

	curriculumProtected := rg.Group("/curriculum")
	curriculumProtected.Use(authMiddleware)
	{
		curriculumProtected.POST("/lessons/:id/complete", completeRateLimiter, h.CompleteLesson)
		curriculumProtected.POST("/grammar-points/:id/check", completeRateLimiter, h.SubmitGrammarCheck)
		curriculumProtected.POST("/kana/practice", completeRateLimiter, h.SubmitKanaPractice)
	}
}

