package language

import (
	"codeabroad/backend/internal/domain"
)

// Helper encapsulates business logic validations for language tracks
type Helper struct{}

// NewHelper creates a new language Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// ValidateLanguageActive ensures the requested language track is currently active
func (h *Helper) ValidateLanguageActive(lang *domain.Language) error {
	if lang == nil {
		return domain.ErrLanguageNotFound
	}
	if !lang.IsActive {
		return domain.ErrLanguageNotActive
	}
	return nil
}

