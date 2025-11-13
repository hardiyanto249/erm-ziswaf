package config

import (
	"erm-backend/internal/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi ke database: ", err)
	}

	// Auto Migrate: Membuat tabel otomatis berdasarkan struct
	err = database.AutoMigrate(&models.RiskItem{}, &models.ComplianceItem{}, &models.ZisTrackingStats{})
	if err != nil {
		log.Fatal("Gagal migrasi database: ", err)
	}

	DB = database
	seedDummyData()
}

// seedDummyData mengisi data awal jika tabel kosong
func seedDummyData() {
	var count int64
	DB.Model(&models.RiskItem{}).Count(&count)
	if count == 0 {
		risks := []models.RiskItem{
			{ID: "OP-001", Description: "Kurang tepat dalam menentukan delapan ashnaf", Category: "Operational", Impact: "High", Likelihood: "Medium", Status: "Open"},
			{ID: "RP-001", Description: "Kampanye negatif di media sosial", Category: "Reputation", Impact: "Critical", Likelihood: "Medium", Status: "Monitoring"},
			{ID: "SH-001", Description: "Instrumen investasi dana ZIS tidak sesuai fatwa DPS", Category: "ShariaCompliance", Impact: "Critical", Likelihood: "Low", Status: "Open"},
		}
		DB.Create(&risks)
		log.Println("Data dummy Risks berhasil dibuat.")
	}

	// Seed ZIS Stats Dummy
	DB.Model(&models.ZisTrackingStats{}).Count(&count)
	if count == 0 {
		stats := models.ZisTrackingStats{
			TotalCollected:   925000000,
			TotalDistributed: 710000000,
			MuzakkiCount:     15480,
			MustahikCount:    8950,
		}
		DB.Create(&stats)
		log.Println("Data dummy ZIS Stats berhasil dibuat.")
	}
}
