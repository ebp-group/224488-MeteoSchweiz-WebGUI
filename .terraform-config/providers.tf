terraform {
  backend "azurerm" {}
}
provider "azurerm" {
  subscription_id = var.subscription
  features {}
}