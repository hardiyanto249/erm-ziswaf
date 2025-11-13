package models

import (
	"time"

	"gorm.io/gorm"
)

// RiskItem merepresentasikan risiko (Sesuai types.ts)
type RiskItem struct {
	ID          string         `gorm:"primaryKey" json:"id"` // Menggunakan String ID sesuai frontend (misal: OP-001)
	Description string         `json:"description"`
	Category    string         `json:"category"`
	Impact      string         `json:"impact"`
	Likelihood  string         `json:"likelihood"`
	Status      string         `json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"` // Soft delete
}

// ComplianceItem untuk checklist kepatuhan syariah
type ComplianceItem struct {
	ID        string `gorm:"primaryKey" json:"id"`
	Text      string `json:"text"`
	Completed bool   `json:"completed"`
}

// ZisTrackingStats untuk data dummy tracking ZIS
type ZisTrackingStats struct {
	ID               uint      `gorm:"primaryKey" json:"-"`
	TotalCollected   float64   `json:"total_collected"`
	TotalDistributed float64   `json:"total_distributed"`
	MuzakkiCount     int       `json:"muzakki_count"`
	MustahikCount    int       `json:"mustahik_count"`
	UpdatedAt        time.Time `json:"last_updated"`
}
