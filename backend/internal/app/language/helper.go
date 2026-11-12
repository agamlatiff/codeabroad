package language

// Helper encapsulates business logic validations for language tracks
type Helper struct{}

// NewHelper creates a new language Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// ValidateLanguageActive ensures the requested language track is currently active
func (h *Helper) ValidateLanguageActive(lang *Language) error {
	if lang == nil {
		return ErrLanguageNotFound
	}
	if !lang.IsActive {
		return ErrLanguageNotActive
	}
	return nil
}

