package handlers

import (
	"erm-backend/internal/config"
	"erm-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// --- RISK MANAGEMENT HANDLERS ---

// GetRisks mengambil semua data risiko
func GetRisks(c *gin.Context) {
	var risks []models.RiskItem
	if err := config.DB.Find(&risks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, risks)
}

// CreateRisk menambahkan risiko baru
func CreateRisk(c *gin.Context) {
	var input models.RiskItem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat risk. ID mungkin duplikat."})
		return
	}
	c.JSON(http.StatusCreated, input)
}

// UpdateRisk mengupdate risiko berdasarkan ID
func UpdateRisk(c *gin.Context) {
	id := c.Param("id")
	var risk models.RiskItem
	if err := config.DB.First(&risk, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Risk tidak ditemukan"})
		return
	}

	var input models.RiskItem
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&risk).Updates(input)
	c.JSON(http.StatusOK, risk)
}

// DeleteRisk menghapus risiko
func DeleteRisk(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.RiskItem{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Risk berhasil dihapus"})
}

// --- EXTERNAL / PUBLIC API HANDLERS ---
// API ini disiapkan untuk pihak ketiga/transparansi publik

// GetPublicZisStats memberikan data statistik ZIS (Read Only)
func GetPublicZisStats(c *gin.Context) {
	var stats models.ZisTrackingStats
	// Mengambil data terakhir (karena hanya dummy row 1)
	if err := config.DB.Last(&stats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Data tidak tersedia"})
		return
	}

	// Simulasi response API yang bersih untuk publik
	response := gin.H{
		"period": "2024-Current",
		"data": gin.H{
			"collection_total":   stats.TotalCollected,
			"distribution_total": stats.TotalDistributed,
			"beneficiaries":      stats.MustahikCount,
			"donors":             stats.MuzakkiCount,
		},
		"status": "Audited",
	}

	c.JSON(http.StatusOK, response)
}
