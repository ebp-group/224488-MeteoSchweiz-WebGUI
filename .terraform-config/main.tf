# Resource Group for Management Services
resource "azurerm_resource_group" "mgmt" {
  name     = "rg-${var.location_name_short}-mgmt-${var.environment}"
  location = var.location
  tags     = var.tags
}

# Resource Group for Management Services
resource "azurerm_resource_group" "srv" {
  name     = "rg-${var.location_name_short}-srv-${var.environment}"
  location = var.location
  tags     = var.tags
}

# Azure Static Web App
resource "azurerm_static_web_app" "static_web_app" {
  name                = "aswa-${var.location_name_short}-${var.subscription_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.srv.name
  location            = azurerm_resource_group.srv.location
  sku_size            = var.sku_size
  sku_tier            = var.sku_tier
  tags                = var.tags
}

# Custom domain for Static Web App
resource "azurerm_static_web_app_custom_domain" "static_web_app_custom_domain" {
  static_web_app_id = azurerm_static_web_app.static_web_app.id
  domain_name       = var.cname_domain
  validation_type   = "cname-delegation"
}
