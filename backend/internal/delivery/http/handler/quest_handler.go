package handler

import (
	"net/http"

	"codeabroad/backend/internal/delivery/http/response"
	"codeabroad/backend/internal/domain"
	"github.com/gin-gonic/gin"
)

// QuestHandler handles HTTP requests for quests and interactive workspaces
type QuestHandler struct {
	questUsecase domain.QuestUsecase
}

// NewQuestHandler creates a new QuestHandler instance
func NewQuestHandler(questUsecase domain.QuestUsecase) *QuestHandler {
	return &QuestHandler{questUsecase: questUsecase}
}

// ListQuests handles GET /api/v1/quests
func (h *QuestHandler) ListQuests(c *gin.Context) {
	userID := c.GetString("userID")
	questType := c.Query("type")
	careerPathID := c.Query("career_path_id")
	chapterID := c.Query("chapter_id")

	filter := domain.QuestFilter{}
	if questType != "" {
		filter.Type = &questType
	}
	if careerPathID != "" {
		filter.CareerPathID = &careerPathID
	}
	if chapterID != "" {
		filter.ChapterID = &chapterID
	}

	quests, err := h.questUsecase.ListQuests(c.Request.Context(), filter, userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "quests retrieved successfully", quests)
}

// GetDailyQuests handles GET /api/v1/quests/daily
func (h *QuestHandler) GetDailyQuests(c *gin.Context) {
	userID := c.GetString("userID")

	quests, err := h.questUsecase.GetDailyQuests(c.Request.Context(), userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "daily quests retrieved successfully", quests)
}

// GetQuestDetails handles GET /api/v1/quests/:id
func (h *QuestHandler) GetQuestDetails(c *gin.Context) {
	userID := c.GetString("userID")
	questID := c.Param("id")

	quest, err := h.questUsecase.GetQuestDetails(c.Request.Context(), questID, userID)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "quest details retrieved successfully", quest)
}

// RunTests handles POST /api/v1/quests/:id/run-tests
func (h *QuestHandler) RunTests(c *gin.Context) {
	questID := c.Param("id")

	var req domain.RunTestsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.questUsecase.RunUnitTests(c.Request.Context(), questID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "unit tests executed successfully", res)
}

// SubmitQuest handles POST /api/v1/quests/:id/submit
func (h *QuestHandler) SubmitQuest(c *gin.Context) {
	userID := c.GetString("userID")
	if userID == "" {
		response.Error(c, domain.ErrUnauthorized)
		return
	}
	questID := c.Param("id")

	var req domain.SubmitQuestRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	res, err := h.questUsecase.SubmitQuest(c.Request.Context(), questID, userID, &req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Success(c, http.StatusOK, "quest completed successfully", res)
}

// RegisterRoutes registers the quest routes under the provided router group
func (h *QuestHandler) RegisterRoutes(r *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	quests := r.Group("/quests")
	quests.Use(authMiddleware)
	{
		quests.GET("", h.ListQuests)
		quests.GET("/daily", h.GetDailyQuests)
		quests.GET("/:id", h.GetQuestDetails)
		quests.POST("/:id/run-tests", h.RunTests)
		quests.POST("/:id/submit", h.SubmitQuest)
	}
}
