package main

import (
	"erm-backend/internal/config"
	"erm-backend/internal/handlers"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load Environment Variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// 2. Connect Database
	config.ConnectDatabase()

	// 3. Setup Router
	r := gin.Default()

	// 4. Setup CORS (Penting agar Frontend Vite bisa akses Backend)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("ALLOW_ORIGIN")}, // e.g., http://localhost:3000
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// 5. Routes
	// API Internal untuk Dashboard Admin
	api := r.Group("/api/v1")
	{
		// Risk Routes
		api.GET("/risks", handlers.GetRisks)
		api.POST("/risks", handlers.CreateRisk)
		api.PUT("/risks/:id", handlers.UpdateRisk)
		api.DELETE("/risks/:id", handlers.DeleteRisk)

		// Compliance Routes (Placeholder)
		// api.GET("/compliance", handlers.GetCompliance)
	}

	// API Eksternal / Publik (Data Dummy yang disiapkan)
	publicApi := r.Group("/api/public")
	{
		publicApi.GET("/zis-stats", handlers.GetPublicZisStats)
	}

	// 6. Run Server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server berjalan di port " + port)
	r.Run(":" + port)
}
